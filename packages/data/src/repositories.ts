import { Task, Plan, User, Schedule, AgentOutput, Project, TaskKind, ScheduledTask } from '@automation/types';
import { taskStorage, planStorage, projectStorage, userStorage, scheduleStorage, agentOutputStorage } from './storage';
import { getSupabase } from './supabase-client';

// Utility function to generate IDs
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const supabaseClient = getSupabase();

const ensureArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.length) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return value.split(',').map((it) => it.trim()).filter(Boolean);
    }
  }
  return [];
};

const mapTaskRecord = (record: any): Task => {
  const normalized = {
    ...record,
    estimatedTime: record.estimated_time ?? record.estimatedTime ?? 0,
    actualTime: record.actual_time ?? record.actualTime,
    focusLevel: record.focus_level ?? record.focusLevel ?? 'medium',
    dueDate: record.due_date ? new Date(record.due_date) : record.dueDate ? new Date(record.dueDate) : undefined,
    createdAt: record.created_at ? new Date(record.created_at) : record.createdAt ? new Date(record.createdAt) : new Date(),
    updatedAt: record.updated_at ? new Date(record.updated_at) : record.updatedAt ? new Date(record.updatedAt) : new Date(),
    parentTaskId: record.parent_task_id ?? record.parentTaskId,
    subtasks: ensureArray(record.subtasks ?? record.subtasks_json),
    dependencies: ensureArray(record.dependencies ?? record.dependencies_json),
    tags: ensureArray(record.tags ?? record.tags_json),
    energyRequirement: record.energy_requirement ?? record.energyRequirement ?? 'medium',
    context: record.context ?? record.location ?? 'anywhere',
    isRecurring: record.is_recurring ?? record.isRecurring,
    recurrencePattern: record.recurrence_pattern ?? record.recurrencePattern,
    kind: record.kind ?? 'todo',
    projectId: record.project_id ?? record.projectId,
    recurrencePerWeek: record.recurrence_per_week ?? record.recurrencePerWeek,
    userId: record.user_id ?? record.userId,
  };

  return {
    id: normalized.id,
    title: normalized.title,
    description: normalized.description,
    status: normalized.status,
    priority: normalized.priority,
    estimatedTime: normalized.estimatedTime,
    actualTime: normalized.actualTime,
    focusLevel: normalized.focusLevel,
    dueDate: normalized.dueDate,
    createdAt: normalized.createdAt,
    updatedAt: normalized.updatedAt,
    parentTaskId: normalized.parentTaskId,
    subtasks: normalized.subtasks,
    dependencies: normalized.dependencies,
    tags: normalized.tags,
    energyRequirement: normalized.energyRequirement,
    context: normalized.context,
    isRecurring: normalized.isRecurring,
    recurrencePattern: normalized.recurrencePattern,
    kind: normalized.kind,
    projectId: normalized.projectId,
    recurrencePerWeek: normalized.recurrencePerWeek,
    userId: normalized.userId,
  };
};

const buildTaskPayload = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Record<string, any> => ({
  title: task.title,
  description: task.description ?? null,
  status: task.status,
  priority: task.priority,
  estimated_time: task.estimatedTime,
  actual_time: task.actualTime ?? null,
  focus_level: task.focusLevel,
  due_date: task.dueDate ? task.dueDate.toISOString() : null,
  parent_task_id: task.parentTaskId ?? null,
  subtasks: task.subtasks ?? [],
  dependencies: task.dependencies ?? [],
  tags: task.tags ?? [],
  energy_requirement: task.energyRequirement,
  context: task.context,
  is_recurring: task.isRecurring ?? false,
  recurrence_pattern: task.recurrencePattern ?? null,
  kind: task.kind ?? 'todo',
  project_id: task.projectId ?? null,
  recurrence_per_week: task.recurrencePerWeek ?? null,
  user_id: task.userId ?? null,
});

const buildTaskUpdatePayload = (
  updates: Partial<Omit<Task, 'id' | 'createdAt'>>
): Record<string, any> => {
  const payload: Record<string, any> = { updated_at: new Date().toISOString() };
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.priority !== undefined) payload.priority = updates.priority;
  if (updates.estimatedTime !== undefined) payload.estimated_time = updates.estimatedTime;
  if (updates.actualTime !== undefined) payload.actual_time = updates.actualTime;
  if (updates.focusLevel !== undefined) payload.focus_level = updates.focusLevel;
  if (updates.dueDate !== undefined) payload.due_date = updates.dueDate ? updates.dueDate.toISOString() : null;
  if (updates.parentTaskId !== undefined) payload.parent_task_id = updates.parentTaskId;
  if (updates.subtasks !== undefined) payload.subtasks = updates.subtasks;
  if (updates.dependencies !== undefined) payload.dependencies = updates.dependencies;
  if (updates.tags !== undefined) payload.tags = updates.tags;
  if (updates.energyRequirement !== undefined) payload.energy_requirement = updates.energyRequirement;
  if (updates.context !== undefined) payload.context = updates.context;
  if (updates.isRecurring !== undefined) payload.is_recurring = updates.isRecurring;
  if (updates.recurrencePattern !== undefined) payload.recurrence_pattern = updates.recurrencePattern;
  if (updates.kind !== undefined) payload.kind = updates.kind;
  if (updates.projectId !== undefined) payload.project_id = updates.projectId;
  if (updates.recurrencePerWeek !== undefined) payload.recurrence_per_week = updates.recurrencePerWeek;
  if (updates.userId !== undefined) payload.user_id = updates.userId;
  return payload;
};

const parseJsonField = (value: unknown, fallback: any = null) => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }
  return value;
};

const normalizeScheduledTasks = (value: unknown): ScheduledTask[] => {
  const raw = Array.isArray(value) ? value : [];
  return raw.map((task: any) => ({
    taskId: task.taskId ?? task.task_id ?? '',
    scheduledStart: task.scheduledStart
      ? new Date(task.scheduledStart)
      : task.scheduled_start
      ? new Date(task.scheduled_start)
      : new Date(),
    scheduledEnd: task.scheduledEnd
      ? new Date(task.scheduledEnd)
      : task.scheduled_end
      ? new Date(task.scheduled_end)
      : new Date(),
    actualStart: task.actualStart
      ? new Date(task.actualStart)
      : task.actual_start
      ? new Date(task.actual_start)
      : undefined,
    actualEnd: task.actualEnd
      ? new Date(task.actualEnd)
      : task.actual_end
      ? new Date(task.actual_end)
      : undefined,
    status: task.status ?? 'scheduled',
    location: task.location ?? null,
    context: task.context ?? null,
  }));
};

const serializeScheduledTasks = (tasks: ScheduledTask[]): any[] =>
  tasks.map((task) => ({
    taskId: task.taskId,
    scheduledStart: task.scheduledStart.toISOString(),
    scheduledEnd: task.scheduledEnd.toISOString(),
    actualStart: task.actualStart ? task.actualStart.toISOString() : null,
    actualEnd: task.actualEnd ? task.actualEnd.toISOString() : null,
    status: task.status,
    location: task.location ?? null,
    context: task.context ?? null,
  }));

const mapPlanRecord = (record: any): Plan => ({
  id: record.id,
  title: record.title,
  description: record.description,
  status: record.status,
  tasks: ensureArray(record.tasks ?? record.task_ids),
  createdAt: record.created_at ? new Date(record.created_at) : new Date(),
  updatedAt: record.updated_at ? new Date(record.updated_at) : new Date(),
  startDate: record.start_date ? new Date(record.start_date) : undefined,
  endDate: record.end_date ? new Date(record.end_date) : undefined,
  goal: record.goal ?? '',
  constraints: parseJsonField(record.constraints, {}),
  userId: record.user_id ?? undefined,
});

const buildPlanPayload = (plan: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>): Record<string, any> => ({
  title: plan.title,
  description: plan.description ?? null,
  status: plan.status,
  tasks: plan.tasks ?? [],
  start_date: plan.startDate ? plan.startDate.toISOString() : null,
  end_date: plan.endDate ? plan.endDate.toISOString() : null,
  goal: plan.goal,
  constraints: plan.constraints ?? {},
  user_id: plan.userId ?? null,
});

const buildPlanUpdatePayload = (
  updates: Partial<Omit<Plan, 'id' | 'createdAt'>>
): Record<string, any> => {
  const payload: Record<string, any> = { updated_at: new Date().toISOString() };
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.tasks !== undefined) payload.tasks = updates.tasks;
  if (updates.startDate !== undefined)
    payload.start_date = updates.startDate ? updates.startDate.toISOString() : null;
  if (updates.endDate !== undefined)
    payload.end_date = updates.endDate ? updates.endDate.toISOString() : null;
  if (updates.goal !== undefined) payload.goal = updates.goal;
  if (updates.constraints !== undefined) payload.constraints = updates.constraints;
  if (updates.userId !== undefined) payload.user_id = updates.userId;
  return payload;
};

const mapScheduleRecord = (record: any): Schedule => ({
  id: record.id,
  date: record.date ? new Date(record.date) : new Date(),
  tasks: normalizeScheduledTasks(parseJsonField(record.tasks, [])),
  notes: record.notes ?? '',
  energyProfile: parseJsonField(record.energy_profile, {
    peakHours: [],
    mediumHours: [],
    lowHours: [],
    recoveryTime: 0,
  }),
  constraints: parseJsonField(record.constraints, { maxTasks: 0, maxDeepWorkSessions: 0 }),
  validation: parseJsonField(record.validation, undefined),
  userId: record.user_id ?? undefined,
  createdAt: record.created_at ? new Date(record.created_at) : new Date(),
  updatedAt: record.updated_at ? new Date(record.updated_at) : new Date(),
});

const buildSchedulePayload = (
  schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>
): Record<string, any> => ({
  date: schedule.date.toISOString(),
  tasks: serializeScheduledTasks(schedule.tasks ?? []),
  notes: schedule.notes ?? '',
  energy_profile: schedule.energyProfile ?? {},
  constraints: schedule.constraints ?? {},
  validation: schedule.validation ?? null,
  user_id: schedule.userId ?? null,
});

// Task Repository
export const taskRepo = {
  getAll: async (options?: { userId?: string }): Promise<Task[]> => {
    if (supabaseClient) {
      try {
        let query = supabaseClient.from('tasks').select('*');
        if (options?.userId) {
          query = query.eq('user_id', options.userId);
        }

        const { data, error } = await query;
        if (error) {
          console.warn('Supabase task fetch error:', error.message);
        } else if (data) {
          return data.map(mapTaskRecord);
        }
      } catch (error) {
        console.warn('[taskRepo] Supabase getAll failed:', error);
      }
    }

    return await taskStorage.getAll();
  },
  
  getById: async (id: string): Promise<Task | null> => {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('tasks')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          return mapTaskRecord(data);
        }
      } catch (error) {
        console.warn('[taskRepo] Supabase getById failed:', error);
      }
    }

    const task = await taskStorage.byId(id);
    return task || null;
  },
  
  create: async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    if (supabaseClient) {
      try {
        const payload = {
          ...buildTaskPayload(taskData),
          id: generateId(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        const { data, error } = await supabaseClient
          .from('tasks')
          .insert(payload)
          .select('*')
          .single();

        if (!error && data) {
          return mapTaskRecord(data);
        }
      } catch (error) {
        console.warn('[taskRepo] Supabase create failed:', error);
      }
    }

    const now = new Date();
    const task: Task = {
      ...taskData,
      id: generateId(),
      createdAt: now,
      updatedAt: now
    };
    
    await taskStorage.save(task);
    return task;
  },
  
  update: async (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task | null> => {
    if (supabaseClient) {
      try {
        const payload = buildTaskUpdatePayload(updates);
        const { data, error } = await supabaseClient
          .from('tasks')
          .update(payload)
          .eq('id', id)
          .select('*')
          .single();

        if (!error && data) {
          return mapTaskRecord(data);
        }
      } catch (error) {
        console.warn('[taskRepo] Supabase update failed:', error);
      }
    }

    const task = await taskStorage.byId(id);
    if (!task) return null;
    
    const updatedTask: Task = {
      ...task,
      ...updates,
      updatedAt: new Date()
    };
    
    await taskStorage.save(updatedTask);
    return updatedTask;
  },
  
  delete: async (id: string): Promise<boolean> => {
    if (supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from('tasks')
          .delete()
          .eq('id', id);

        if (!error) {
          return true;
        }
      } catch (error) {
        console.warn('[taskRepo] Supabase delete failed:', error);
      }
    }

    try {
      await taskStorage.delete(id);
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  },
  
  getByPlan: async (planId: string): Promise<Task[]> => {
    return await taskStorage.byPlan(planId);
  },
  
  // Find tasks that are due soon
  getByDueDate: async (startDate: Date, endDate: Date): Promise<Task[]> => {
    const tasks = await taskStorage.getAll();
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= startDate && dueDate <= endDate;
    });
  },
  
  // Find tasks with specific tags
  getByTags: async (tags: string[]): Promise<Task[]> => {
    const tasks = await taskStorage.getAll();
    return tasks.filter(task => 
      tags.some(tag => task.tags.includes(tag))
    );
  },
  
  // Get tasks with specific status
  getByStatus: async (status: Task['status']): Promise<Task[]> => {
    const tasks = await taskStorage.getAll();
    return tasks.filter(task => task.status === status);
  },

  getByProject: async (projectId: string): Promise<Task[]> => {
    const tasks = await taskStorage.getAll();
    return tasks.filter(task => task.projectId === projectId);
  },

  getByKind: async (kind: TaskKind): Promise<Task[]> => {
    const tasks = await taskStorage.getAll();
    return tasks.filter(task => (task.kind ?? 'todo') === kind);
  },
};

// Plan Repository
export const planRepo = {
  getAll: async (options?: { userId?: string }): Promise<Plan[]> => {
    if (supabaseClient) {
      try {
        let query = supabaseClient.from('plans').select('*');
        if (options?.userId) {
          query = query.eq('user_id', options.userId);
        }
        const { data, error } = await query;
        if (error) {
          console.warn('[planRepo] Supabase getAll error:', error.message);
        } else if (data) {
          return data.map(mapPlanRecord);
        }
      } catch (error) {
        console.warn('[planRepo] Supabase getAll failed:', error);
      }
    }

    return await planStorage.getAll();
  },
  
  getById: async (id: string): Promise<Plan | null> => {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('plans')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          return mapPlanRecord(data);
        }
      } catch (error) {
        console.warn('[planRepo] Supabase getById failed:', error);
      }
    }

    const plan = await planStorage.byId(id);
    return plan || null;
  },
  
  create: async (planData: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>): Promise<Plan> => {
    if (supabaseClient) {
      try {
        const payload = {
          id: generateId(),
          ...buildPlanPayload(planData),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        const { data, error } = await supabaseClient
          .from('plans')
          .insert(payload)
          .select('*')
          .single();

        if (!error && data) {
          return mapPlanRecord(data);
        }
      } catch (error) {
        console.warn('[planRepo] Supabase create failed:', error);
      }
    }

    const now = new Date();
    const plan: Plan = {
      ...planData,
      id: generateId(),
      createdAt: now,
      updatedAt: now
    };
    
    await planStorage.save(plan);
    return plan;
  },
  
  update: async (id: string, updates: Partial<Omit<Plan, 'id' | 'createdAt'>>): Promise<Plan | null> => {
    if (supabaseClient) {
      try {
        const payload = buildPlanUpdatePayload(updates);
        const { data, error } = await supabaseClient
          .from('plans')
          .update(payload)
          .eq('id', id)
          .select('*')
          .single();

        if (!error && data) {
          return mapPlanRecord(data);
        }
      } catch (error) {
        console.warn('[planRepo] Supabase update failed:', error);
      }
    }

    const plan = await planStorage.byId(id);
    if (!plan) return null;
    
    const updatedPlan: Plan = {
      ...plan,
      ...updates,
      updatedAt: new Date()
    };
    
    await planStorage.save(updatedPlan);
    return updatedPlan;
  },
  
  delete: async (id: string): Promise<boolean> => {
    if (supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from('plans')
          .delete()
          .eq('id', id);

        if (!error) {
          return true;
        }
      } catch (error) {
        console.warn('[planRepo] Supabase delete failed:', error);
      }
    }

    try {
      await planStorage.delete(id);
      return true;
    } catch (error) {
      console.error('Error deleting plan:', error);
      return false;
    }
  },
  
  getByStatus: async (status: Plan['status'], options?: { userId?: string }): Promise<Plan[]> => {
    const plans = await planRepo.getAll(options);
    return plans.filter(plan => plan.status === status);
  }
};

// Project Repository
export const projectRepo = {
  getAll: async (): Promise<Project[]> => await projectStorage.getAll(),
  getById: async (id: string): Promise<Project | null> => {
    const p = await projectStorage.byId(id);
    return p ?? null;
  },
  create: async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
    const now = new Date();
    const project: Project = {
      ...data,
      id: generateId(),
      taskIds: data.taskIds || [],
      createdAt: now,
      updatedAt: now,
    };
    await projectStorage.save(project);
    return project;
  },
  update: async (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<Project | null> => {
    const project = await projectStorage.byId(id);
    if (!project) return null;
    const updated = { ...project, ...updates, updatedAt: new Date() };
    await projectStorage.save(updated);
    return updated;
  },
  delete: async (id: string): Promise<boolean> => {
    try {
      await projectStorage.delete(id);
      return true;
    } catch {
      return false;
    }
  },
};

// User Repository
export const userRepo = {
  getAll: async (): Promise<User[]> => {
    return await userStorage.getAll();
  },

  getById: async (id: string): Promise<User | null> => {
    const user = await userStorage.byId(id);
    return user || null;
  },

  create: async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>, id?: string): Promise<User> => {
    const now = new Date();
    const user: User = {
      ...userData,
      id: id || generateId(),
      createdAt: now,
      updatedAt: now
    };

    await userStorage.save(user);
    return user;
  },

  update: async (id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> => {
    const user = await userStorage.byId(id);
    if (!user) return null;

    const updatedUser: User = {
      ...user,
      ...updates,
      updatedAt: new Date()
    };

    await userStorage.save(updatedUser);
    return updatedUser;
  }
};

// Schedule Repository
export const scheduleRepo = {
  getAll: async (options?: { userId?: string }): Promise<Schedule[]> => {
    if (supabaseClient) {
      try {
        let query = supabaseClient.from('schedules').select('*');
        if (options?.userId) {
          query = query.eq('user_id', options.userId);
        }
        const { data, error } = await query;
        if (error) {
          console.warn('[scheduleRepo] Supabase getAll error:', error.message);
        } else if (data) {
          return data.map(mapScheduleRecord);
        }
      } catch (error) {
        console.warn('[scheduleRepo] Supabase getAll failed:', error);
      }
    }

    return await scheduleStorage.getAll();
  },

  getByDate: async (date: Date, options?: { userId?: string }): Promise<Schedule | null> => {
    if (supabaseClient) {
      try {
        let query = supabaseClient
          .from('schedules')
          .select('*')
          .eq('date', date.toISOString().split('T')[0]);
        if (options?.userId) {
          query = query.eq('user_id', options.userId);
        }
        const { data, error } = await query;
        if (!error && data && data.length) {
          return mapScheduleRecord(data[0]);
        }
      } catch (error) {
        console.warn('[scheduleRepo] Supabase getByDate failed:', error);
      }
    }

    const schedule = await scheduleStorage.byDate(date);
    return schedule || null;
  },

  create: async (scheduleData: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<Schedule> => {
    if (supabaseClient) {
      try {
        const payload = {
          id: generateId(),
          ...buildSchedulePayload(scheduleData),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        const { data, error } = await supabaseClient
          .from('schedules')
          .insert(payload)
          .select('*')
          .single();

        if (!error && data) {
          return mapScheduleRecord(data);
        }
      } catch (error) {
        console.warn('[scheduleRepo] Supabase create failed:', error);
      }
    }

    const now = new Date();
    const schedule: Schedule = {
      ...scheduleData,
      id: generateId(),
      createdAt: now,
      updatedAt: now
    };

    await scheduleStorage.save(schedule);
    return schedule;
  },

  update: async (id: string, updates: Partial<Omit<Schedule, 'id' | 'createdAt'>>): Promise<Schedule | null> => {
    if (supabaseClient) {
      try {
        const payload: Record<string, any> = { updated_at: new Date().toISOString() };
        if (updates.date !== undefined) payload.date = updates.date.toISOString();
        if (updates.tasks !== undefined) payload.tasks = updates.tasks;
        if (updates.notes !== undefined) payload.notes = updates.notes;
        if (updates.energyProfile !== undefined) payload.energy_profile = updates.energyProfile;
        if (updates.constraints !== undefined) payload.constraints = updates.constraints;
        if (updates.validation !== undefined) payload.validation = updates.validation;
        if (updates.userId !== undefined) payload.user_id = updates.userId;

        const { data, error } = await supabaseClient
          .from('schedules')
          .update(payload)
          .eq('id', id)
          .select('*')
          .single();

        if (!error && data) {
          return mapScheduleRecord(data);
        }
      } catch (error) {
        console.warn('[scheduleRepo] Supabase update failed:', error);
      }
    }

    const schedules = await scheduleStorage.getAll();
    const schedule = schedules.find(s => s.id === id);
    if (!schedule) return null;

    const updatedSchedule: Schedule = {
      ...schedule,
      ...updates,
      updatedAt: new Date()
    };

    await scheduleStorage.save(updatedSchedule);
    return updatedSchedule;
  },

  getByDateRange: async (startDate: Date, endDate: Date, options?: { userId?: string }): Promise<Schedule[]> => {
    if (supabaseClient) {
      try {
        let query = supabaseClient
          .from('schedules')
          .select('*')
          .gte('date', startDate.toISOString().split('T')[0])
          .lte('date', endDate.toISOString().split('T')[0]);
        if (options?.userId) {
          query = query.eq('user_id', options.userId);
        }
        const { data, error } = await query;
        if (!error && data) {
          return data.map(mapScheduleRecord);
        }
      } catch (error) {
        console.warn('[scheduleRepo] Supabase getByDateRange failed:', error);
      }
    }

    const schedules = await scheduleStorage.getAll();
    return schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.date);
      return scheduleDate >= startDate && scheduleDate <= endDate;
    });
  }
};

// Agent Output Repository
export const agentOutputRepo = {
  getAll: async (): Promise<AgentOutput[]> => {
    return await agentOutputStorage.getAll();
  },

  create: async (outputData: Omit<AgentOutput, 'timestamp'>): Promise<AgentOutput> => {
    const output: AgentOutput = {
      ...outputData,
      timestamp: new Date()
    };

    await agentOutputStorage.save(output);
    return output;
  },

  getByAgentType: async (agentType: AgentOutput['agentType']): Promise<AgentOutput[]> => {
    const outputs = await agentOutputStorage.getAll();
    return outputs.filter(output => output.agentType === agentType);
  }
};
