export interface ClickUpTaskPayload {
  name: string;
  description?: string;
  status?: string;
  priority?: number;
  due_date?: number;
  time_estimate?: number;
  tags?: string[];
  assignees?: string[];
}

export interface SyncOptions {
  allowOverride?: boolean;
  dryRun?: boolean;
}

/**
 * ClickUp integration stub with explicit mapping and override controls.
 * Real API calls should respect `allowOverride` and surface a preview before sync.
 */
export class ClickUpService {
  mapTaskToClickUp(task: any): ClickUpTaskPayload {
    return {
      name: task.title,
      description: task.description,
      status: task.status,
      priority: this.mapPriority(task.priority),
      due_date: task.dueDate ? new Date(task.dueDate).getTime() : undefined,
      time_estimate: task.estimatedTime ? task.estimatedTime * 60000 : undefined,
      tags: task.tags,
    };
  }

  async previewSync(task: any) {
    const payload = this.mapTaskToClickUp(task);
    return {
      payload,
      requiresConfirmation: true,
      summary: `Will create/update ClickUp task: "${payload.name}" with priority ${payload.priority || 'default'}.`,
      note: 'AI is a translator; review this mapping before it becomes an authority in ClickUp.',
    };
  }

  async syncTask(task: any, options: SyncOptions = {}) {
    const payload = this.mapTaskToClickUp(task);

    if (!options.allowOverride) {
      return {
        synced: false,
        requiresConfirmation: true,
        message: 'ClickUp sync requires explicit user confirmation (Philosophy 2.1).',
        payload,
      };
    }

    if (options.dryRun) {
      return { synced: false, dryRun: true, payload };
    }

    // TODO: call ClickUp API here
    return { synced: true, payload, id: `clickup_${Date.now()}` };
  }

  private mapPriority(priority: string | undefined) {
    switch (priority) {
      case 'urgent': return 1;
      case 'high': return 2;
      case 'medium': return 3;
      case 'low': return 4;
      default: return undefined;
    }
  }
}

export const clickUpService = new ClickUpService();
