import { differenceInMinutes, isAfter, isBefore, format } from 'date-fns';
import {
  ScheduledTask,
  Task,
  TimeBlock,
  User,
  ValidationIssue,
  ValidationResult,
  Project,
} from '@automation/types';
import { computePressure } from './pressure-service';

type ScheduledLike = ScheduledTask | TimeBlock;

export class ValidationService {
  /**
   * Validate a proposed schedule before persistence.
   * Returns blocking errors, warnings, and a human-friendly summary.
   */
  validateSchedule(params: {
    tasks: Task[];
    scheduled: ScheduledTask[];
    events?: TimeBlock[];
    user?: User;
    date?: Date;
  }): ValidationResult {
    const issues: ValidationIssue[] = [];
    const events = params.events ?? [];
    const user = params.user;

    // Hard conflicts: overlap between scheduled tasks and existing events
    for (const taskBlock of params.scheduled) {
      const conflict = events.find((evt) =>
        this.overlaps(taskBlock, evt)
      );
      if (conflict) {
        issues.push({
          code: 'hard_conflict',
          severity: 'error',
          message: `Task ${taskBlock.taskId} overlaps ${conflict.type} (${this.rangeLabel(conflict)})`,
          relatedIds: [taskBlock.taskId],
          details: 'Hard overlap detected',
        });
      }
    }

    // Hard conflicts: overlapping scheduled tasks
    const sorted = [...params.scheduled].sort(
      (a, b) => a.scheduledStart.getTime() - b.scheduledStart.getTime()
    );
    for (let i = 0; i < sorted.length - 1; i++) {
      if (this.overlaps(sorted[i], sorted[i + 1])) {
        issues.push({
          code: 'task_overlap',
          severity: 'error',
          message: `Tasks ${sorted[i].taskId} and ${sorted[i + 1].taskId} overlap (${this.rangeLabel(sorted[i])})`,
          relatedIds: [sorted[i].taskId, sorted[i + 1].taskId],
        });
      }
    }

    // Semantic conflicts: deep work late night or beyond workday
    for (const block of params.scheduled) {
      const task = params.tasks.find((t) => t.id === block.taskId);
      if (!task) continue;

      const hour = block.scheduledStart.getHours();
      if (task.focusLevel === 'deep' && (hour < 8 || hour >= 18)) {
        issues.push({
          code: 'semantic_energy_mismatch',
          severity: 'warn',
          message: `Deep work task "${task.title}" is scheduled outside typical focus hours`,
          relatedIds: [task.id],
        });
      }

      // Unrealistic duration check
      const duration = differenceInMinutes(block.scheduledEnd, block.scheduledStart);
      if (duration > 240) {
        issues.push({
          code: 'duration_exceeds_4h',
          severity: 'warn',
          message: `Task "${task.title}" is scheduled for ${duration} minutes; recommend splitting`,
          relatedIds: [task.id],
        });
      }
    }

    // Cognitive load: total scheduled minutes vs. work window
    const totalMinutes = params.scheduled.reduce(
      (sum, t) => sum + differenceInMinutes(t.scheduledEnd, t.scheduledStart),
      0
    );
    const workWindowMinutes = 8 * 60;
    if (totalMinutes > workWindowMinutes) {
      issues.push({
        code: 'cognitive_overload',
        severity: 'warn',
        message: `Total scheduled time (${totalMinutes}m) exceeds standard work window (${workWindowMinutes}m).`,
      });
    }

    // Physical feasibility: travel time/transition time (Semantic)
    for (let i = 0; i < sorted.length - 1; i++) {
      const first = sorted[i];
      const second = sorted[i + 1];
      const gap = differenceInMinutes(second.scheduledStart, first.scheduledEnd);
      
      if (gap < 5 && gap >= 0) {
        issues.push({
          code: 'insufficient_transition',
          severity: 'warn',
          message: `Back-to-back tasks without transition time: ${this.rangeLabel(first)} and ${this.rangeLabel(second)}`,
          relatedIds: [first.taskId, second.taskId],
        });
      }

      // Check for location changes (if location is available in metadata or context)
      if (first.location && second.location && first.location !== second.location && gap < 30) {
        issues.push({
          code: 'location_conflict_travel',
          severity: 'warn',
          message: `Infeasible travel time between ${first.location} and ${second.location} (${gap}m gap)`,
          relatedIds: [first.taskId, second.taskId],
        });
      }
    }

    // Time sanity: start before end
    for (const block of params.scheduled) {
      if (!isBefore(block.scheduledStart, block.scheduledEnd)) {
        issues.push({
          code: 'invalid_time_range',
          severity: 'error',
          message: `Task ${block.taskId} has an invalid time range`,
          relatedIds: [block.taskId],
        });
      }
    }

    const blocking = issues.some((i) => i.severity === 'error');
    const requiresConfirmation = issues.length > 0;

    return {
      ok: !blocking,
      requiresConfirmation,
      issues,
      summary: this.buildSummary(issues, user),
    };
  }

  /**
   * Validate task input before creation/update.
   * Enforces time presence, duration sanity, and dependency sanity.
   */
  validateTaskInput(params: {
    task: Partial<Task>;
    existing?: Task[];
    projects?: Project[];
  }): ValidationResult {
    const { task, existing = [], projects = [] } = params;
    const issues: ValidationIssue[] = [];

    // Time is required for actionable items (todo/reminder). Habits/dailies can rely on recurrence.
    const kind = task.kind ?? 'todo';
    if (!task.dueDate && kind !== 'habit' && kind !== 'daily') {
      issues.push({
        code: 'time_missing',
        severity: 'error',
        message: 'A concrete time (due date or schedule) is required before committing the task.',
      });
    }

    // Weekly Pressure Check
    if (existing.length > 0) {
      const currentPressure = computePressure(existing as Task[], projects);
      if (currentPressure.totalHours > 40) {
        issues.push({
          code: 'weekly_overload',
          severity: 'warn',
          message: `Weekly workload is high (${currentPressure.totalHours.toFixed(1)}h). Consider deferring this task.`,
        });
      }
    }

    // Estimated time sanity
    if (typeof task.estimatedTime === 'number' && task.estimatedTime <= 0) {
      issues.push({
        code: 'invalid_estimate',
        severity: 'error',
        message: 'Estimated time must be greater than zero minutes.',
      });
    }
    if (typeof task.estimatedTime === 'number' && task.estimatedTime > 480) {
      issues.push({
        code: 'estimate_exceeds_day',
        severity: 'warn',
        message: 'Estimated time exceeds a full workday; consider splitting the task.',
      });
    }

    // Dependency sanity
    if (task.dependencies && task.dependencies.length) {
      const missing = task.dependencies.filter(
        (dep) => !existing.find((t) => t.id === dep)
      );
      if (missing.length) {
        issues.push({
          code: 'dependency_missing',
          severity: 'error',
          message: `Dependencies not found: ${missing.join(', ')}`,
          relatedIds: missing,
        });
      }
    }

    return {
      ok: !issues.some((i) => i.severity === 'error'),
      requiresConfirmation: issues.length > 0,
      issues,
      summary: this.buildSummary(issues),
    };
  }

  private overlaps(a: ScheduledLike, b: ScheduledLike): boolean {
    const startA = 'scheduledStart' in a ? a.scheduledStart : a.start;
    const endA = 'scheduledEnd' in a ? a.scheduledEnd : a.end;
    const startB = 'scheduledStart' in b ? b.scheduledStart : b.start;
    const endB = 'scheduledEnd' in b ? b.scheduledEnd : b.end;
    return isBefore(startA, endB) && isAfter(endA, startB);
  }

  private buildSummary(issues: ValidationIssue[], user?: User): string[] {
    if (!issues.length) return ['Validation passed – no conflicts detected'];
    const blocking = issues.filter((i) => i.severity === 'error').length;
    const warnings = issues.filter((i) => i.severity === 'warn').length;

    const summary: string[] = [
      `${blocking} blocking issue(s), ${warnings} warning(s) detected`,
    ];

    const top = issues.slice(0, 5).map((i) => `${i.severity.toUpperCase()}: ${i.message}`);
    summary.push(...top);

    if (user?.preferences?.notificationSettings?.scheduleChanges) {
      summary.push('User notifications enabled: schedule changes should be summarized before send.');
    }

    return summary;
  }

  private rangeLabel(block: ScheduledLike): string {
    const start = 'scheduledStart' in block ? block.scheduledStart : block.start;
    const end = 'scheduledEnd' in block ? block.scheduledEnd : block.end;
    return `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}–${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
}

export const validationService = new ValidationService();
