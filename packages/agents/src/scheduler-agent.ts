import { Task, Schedule, ScheduledTask } from '@automation/types';
import {
  BaseAgent,
  BaseAgentOutput,
  SchedulerInput,
  SchedulerOutput,
  TimeBlock
} from './base-agent';
import { scheduleRepo, agentOutputRepo } from '@automation/data';
import { GeminiService } from '@automation/services';

export class SchedulerAgent implements BaseAgent<SchedulerInput, SchedulerOutput> {
  type = 'scheduler';

  async process(input: SchedulerInput): Promise<BaseAgentOutput> {
    const { user, tasks, date, existingEvents, constraints } = input;
    const reasoning: string[] = [];

    try {
      // Try using Gemini for scheduling first
      const geminiService = new GeminiService();
      const prompt = geminiService.generatePrompt('scheduler', { 
        date,
        energyProfile: user.preferences.energyProfile,
        existingEvents: existingEvents || [],
        constraints
      });
      
      try {
        const geminiResponse = await geminiService.generateContent(prompt);
        const { schedule: geminiSchedule } = JSON.parse(geminiResponse);
        
        // Convert Gemini response to our schedule
        const scheduledTasks = await this.createScheduledTasksFromGeminiResponse(
          geminiSchedule.tasks,
          tasks
        );
        
        const schedule = await scheduleRepo.create({
          date: date,
          tasks: scheduledTasks,
          notes: `AI scheduled on ${new Date().toLocaleDateString()}`,
          energyProfile: user.preferences.energyProfile,
          constraints: {
            maxTasks: constraints?.maxDeepWorkSessions || 3,
            maxDeepWorkSessions: constraints?.maxDeepWorkSessions || 2
          }
        });

        reasoning.push(`AI scheduled ${scheduledTasks.length} tasks for ${date.toLocaleDateString()}`);
        reasoning.push(`Total estimated work time: ${this.calculateTotalTime(scheduledTasks)} minutes`);
        
        // Record agent output for reflection
        await this.recordAgentOutput(input, { schedule, reasoning });

        return {
          result: { schedule, reasoning } as SchedulerOutput,
          confidence: 0.9, // Higher confidence with AI assistance
          metadata: { scheduleId: schedule.id, taskCount: scheduledTasks.length }
        };
      } catch (geminiError) {
        console.warn('Gemini scheduling failed, using fallback:', geminiError);
        
        // Fallback to rule-based scheduling
        const scheduledTasks = await this.scheduleTasks(
          tasks,
          date,
          existingEvents || [],
          constraints
        );
        
        const schedule = await scheduleRepo.create({
          date: date,
          tasks: scheduledTasks,
          notes: `Fallback scheduled on ${new Date().toLocaleDateString()}`,
          energyProfile: user.preferences.energyProfile,
          constraints: {
            maxTasks: constraints?.maxDeepWorkSessions || 3,
            maxDeepWorkSessions: constraints?.maxDeepWorkSessions || 2
          }
        });

        reasoning.push(`Fallback scheduled ${scheduledTasks.length} tasks for ${date.toLocaleDateString()}`);
        reasoning.push(`Total estimated work time: ${this.calculateTotalTime(scheduledTasks)} minutes`);

        return {
          result: { schedule, reasoning } as SchedulerOutput,
          confidence: 0.6, // Lower confidence with fallback
          metadata: { scheduleId: schedule.id, taskCount: scheduledTasks.length }
        };
      }
    } catch (error) {
      console.error('Error in Scheduler agent:', error);
      return {
        result: null,
        confidence: 0,
        metadata: { error: error instanceof Error ? error.message : String(error) }
      };
    }
  }

  private async scheduleTasks(
    tasks: Task[],
    date: Date,
    existingEvents: TimeBlock[],
    constraints?: any
  ): Promise<ScheduledTask[]> {
    const scheduledTasks: ScheduledTask[] = [];
    
    // Sort tasks by priority
    const sortedTasks = tasks.sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    let currentTime = this.getWorkStartTime(date);
    const workEndTime = this.getWorkEndTime(date);
    let deepWorkSessions = 0;
    const maxDeepWorkSessions = constraints?.maxDeepWorkSessions || 2;

    for (const task of sortedTasks) {
      // Check if we can fit this task
      const taskEndTime = new Date(currentTime.getTime() + task.estimatedTime * 60000);
      
      if (taskEndTime > workEndTime) {
        // Can't fit this task today
        continue;
      }

      // Check for deep work limit
      if (task.focusLevel === 'deep' && deepWorkSessions >= maxDeepWorkSessions) {
        continue;
      }

      // Check for conflicts with existing events
      if (this.hasConflict(currentTime, taskEndTime, existingEvents)) {
        // Find next available slot
        const nextSlot = this.findNextAvailableSlot(taskEndTime, workEndTime, existingEvents);
        if (!nextSlot) continue;
        currentTime = nextSlot;
      }

      if (task.focusLevel === 'deep') {
        deepWorkSessions++;
      }

      scheduledTasks.push({
        taskId: task.id,
        scheduledStart: new Date(currentTime),
        scheduledEnd: taskEndTime,
        status: 'scheduled'
      });

      // Add break time after task
      const breakTime = task.focusLevel === 'deep' ? 15 : 5;
      currentTime = new Date(taskEndTime.getTime() + breakTime * 60000);
    }

    return scheduledTasks;
  }

  private getWorkStartTime(date: Date): Date {
    const start = new Date(date);
    start.setHours(9, 0, 0, 0);
    return start;
  }

  private getWorkEndTime(date: Date): Date {
    const end = new Date(date);
    end.setHours(17, 0, 0, 0);
    return end;
  }

  private hasConflict(start: Date, end: Date, events: TimeBlock[]): boolean {
    return events.some(event => 
      (start < new Date(event.end) && end > new Date(event.start))
    );
  }

  private findNextAvailableSlot(
    currentTime: Date,
    workEndTime: Date,
    events: TimeBlock[]
  ): Date | null {
    let slotStart = currentTime;
    
    while (slotStart < workEndTime) {
      const conflict = events.find(event =>
        slotStart < new Date(event.end) && slotStart > new Date(event.start)
      );
      
      if (!conflict) return slotStart;
      slotStart = new Date(conflict.end);
    }
    
    return null;
  }

  private calculateTotalTime(scheduledTasks: ScheduledTask[]): number {
    return scheduledTasks.reduce((total, task) => {
      const duration = task.scheduledEnd.getTime() - task.scheduledStart.getTime();
      return total + Math.ceil(duration / 60000);
    }, 0);
  }

  private async createScheduledTasksFromGeminiResponse(geminiTasks: any[], originalTasks: Task[]): Promise<ScheduledTask[]> {
    const scheduledTasks: ScheduledTask[] = [];
    
    // Create a map for quick lookup
    const taskMap = new Map<string, Task>();
    for (const task of originalTasks) {
      taskMap.set(task.id, task);
    }
    
    // Convert Gemini response to our scheduled tasks
    for (const geminiTask of geminiTasks) {
      const scheduledTask: ScheduledTask = {
        taskId: geminiTask.taskId,
        scheduledStart: new Date(geminiTask.scheduledStart),
        scheduledEnd: new Date(geminiTask.scheduledEnd),
        status: 'scheduled'
      };
      
      scheduledTasks.push(scheduledTask);
    }

    return scheduledTasks;
  }

  private async recordAgentOutput(
    input: SchedulerInput,
    output: SchedulerOutput
  ): Promise<void> {
    await agentOutputRepo.create({
      agentType: 'scheduler',
      input: input,
      output: output,
      confidence: 0.85
    });
  }
}