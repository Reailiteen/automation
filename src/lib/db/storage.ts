import { promises as fs } from 'fs';
import path from 'path';
import { Task, Plan, User, Schedule, AgentOutput } from '../models/task';

// Base data directory
const DATA_DIR = path.join(process.cwd(), 'data');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');
const PLANS_FILE = path.join(DATA_DIR, 'plans.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SCHEDULES_FILE = path.join(DATA_DIR, 'schedules.json');
const AGENT_OUTPUTS_FILE = path.join(DATA_DIR, 'agent-outputs.json');

// Initialize data directory and files
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    // Create empty JSON files if they don't exist
    for (const file of [TASKS_FILE, PLANS_FILE, USERS_FILE, SCHEDULES_FILE, AGENT_OUTPUTS_FILE]) {
      try {
        await fs.access(file);
      } catch {
        await fs.writeFile(file, '[]');
      }
    }
  } catch (error) {
    console.error('Error ensuring data directory:', error);
    throw error;
  }
}

// Generic file operations
async function readFile<T>(filePath: string): Promise<T[]> {
  await ensureDataDir();
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading file:', error);
    return [];
  }
}

async function writeFile<T>(filePath: string, data: T[]): Promise<void> {
  await ensureDataDir();
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing file:', error);
    throw error;
  }
}

// Task operations
export const taskStorage = {
  getAll: (): Promise<Task[]> => readFile<Task>(TASKS_FILE),
  byId: async (id: string): Promise<Task | undefined> => {
    const tasks = await readFile<Task>(TASKS_FILE);
    return tasks.find(task => task.id === id);
  },
  byPlan: async (planId: string): Promise<Task[]> => {
    const plans = await readFile<Plan>(PLANS_FILE);
    const plan = plans.find(p => p.id === planId);
    if (!plan) return [];
    
    const tasks = await readFile<Task>(TASKS_FILE);
    return tasks.filter(task => plan.tasks.includes(task.id));
  },
  save: async (task: Task): Promise<void> => {
    const tasks = await readFile<Task>(TASKS_FILE);
    const index = tasks.findIndex(t => t.id === task.id);
    
    if (index >= 0) {
      // Update existing task
      tasks[index] = task;
    } else {
      // Add new task
      tasks.push(task);
    }
    
    await writeFile(TASKS_FILE, tasks);
  },
  delete: async (id: string): Promise<void> => {
    const tasks = await readFile<Task>(TASKS_FILE);
    const filtered = tasks.filter(task => task.id !== id);
    await writeFile(TASKS_FILE, filtered);
  }
};

// Plan operations
export const planStorage = {
  getAll: (): Promise<Plan[]> => readFile<Plan>(PLANS_FILE),
  byId: async (id: string): Promise<Plan | undefined> => {
    const plans = await readFile<Plan>(PLANS_FILE);
    return plans.find(plan => plan.id === id);
  },
  save: async (plan: Plan): Promise<void> => {
    const plans = await readFile<Plan>(PLANS_FILE);
    const index = plans.findIndex(p => p.id === plan.id);
    
    if (index >= 0) {
      plans[index] = plan;
    } else {
      plans.push(plan);
    }
    
    await writeFile(PLANS_FILE, plans);
  },
  delete: async (id: string): Promise<void> => {
    const plans = await readFile<Plan>(PLANS_FILE);
    const filtered = plans.filter(plan => plan.id !== id);
    await writeFile(PLANS_FILE, filtered);
  }
};

// User operations
export const userStorage = {
  getAll: (): Promise<User[]> => readFile<User>(USERS_FILE),
  byId: async (id: string): Promise<User | undefined> => {
    const users = await readFile<User>(USERS_FILE);
    return users.find(user => user.id === id);
  },
  save: async (user: User): Promise<void> => {
    const users = await readFile<User>(USERS_FILE);
    const index = users.findIndex(u => u.id === user.id);
    
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    
    await writeFile(USERS_FILE, users);
  }
};

// Schedule operations
export const scheduleStorage = {
  getAll: (): Promise<Schedule[]> => readFile<Schedule>(SCHEDULES_FILE),
  byDate: async (date: Date): Promise<Schedule | undefined> => {
    const schedules = await readFile<Schedule>(SCHEDULES_FILE);
    return schedules.find(schedule => 
      new Date(schedule.date).toDateString() === date.toDateString()
    );
  },
  save: async (schedule: Schedule): Promise<void> => {
    const schedules = await readFile<Schedule>(SCHEDULES_FILE);
    const index = schedules.findIndex(s => s.id === schedule.id);
    
    if (index >= 0) {
      schedules[index] = schedule;
    } else {
      schedules.push(schedule);
    }
    
    await writeFile(SCHEDULES_FILE, schedules);
  }
};

// Agent output operations
export const agentOutputStorage = {
  getAll: (): Promise<AgentOutput[]> => readFile<AgentOutput>(AGENT_OUTPUTS_FILE),
  save: async (output: AgentOutput): Promise<void> => {
    const outputs = await readFile<AgentOutput>(AGENT_OUTPUTS_FILE);
    outputs.push(output);
    await writeFile(AGENT_OUTPUTS_FILE, outputs);
  }
};