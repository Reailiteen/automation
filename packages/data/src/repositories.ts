import { Task, Plan, User, Schedule, AgentOutput, Project, TaskKind } from '@automation/types';
import { taskStorage, planStorage, projectStorage, userStorage, scheduleStorage, agentOutputStorage } from './storage';

// Utility function to generate IDs
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Task Repository
export const taskRepo = {
  getAll: async (): Promise<Task[]> => {
    return await taskStorage.getAll();
  },

  getById: async (id: string): Promise<Task | null> => {
    const task = await taskStorage.byId(id);
    return task || null;
  },

  create: async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
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
  getAll: async (): Promise<Plan[]> => {
    return await planStorage.getAll();
  },

  getById: async (id: string): Promise<Plan | null> => {
    const plan = await planStorage.byId(id);
    return plan || null;
  },

  create: async (planData: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>): Promise<Plan> => {
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
    try {
      await planStorage.delete(id);
      return true;
    } catch (error) {
      console.error('Error deleting plan:', error);
      return false;
    }
  },

  // Get plans with specific status
  getByStatus: async (status: Plan['status']): Promise<Plan[]> => {
    const plans = await planStorage.getAll();
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
  getAll: async (): Promise<Schedule[]> => {
    return await scheduleStorage.getAll();
  },

  getByDate: async (date: Date): Promise<Schedule | null> => {
    const schedule = await scheduleStorage.byDate(date);
    return schedule || null;
  },

  create: async (scheduleData: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<Schedule> => {
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

  /// Get schedules for a date range
  getByDateRange: async (startDate: Date, endDate: Date): Promise<Schedule[]> => {
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
