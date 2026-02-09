import { promises as fs } from 'fs';
import path from 'path';
import { Task, Plan, User, Schedule, AgentOutput, Project, Reminder, InAppReminder } from '@automation/types';

// Detect if we're in a serverless environment (Netlify Functions, AWS Lambda, etc.)
// In serverless, filesystem is read-only except for /tmp
function detectServerless(): boolean {
  const cwd = process.cwd();
  return !!(
    process.env.NETLIFY === 'true' ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.VERCEL === '1' ||
    process.env.LAMBDA_TASK_ROOT ||
    cwd.includes('/var/task') ||
    cwd === '/var/task' ||
    cwd.startsWith('/tmp') ||
    // Additional check: if cwd is a typical serverless path
    (cwd.startsWith('/') && !cwd.includes('Desktop') && !cwd.includes('home') && !cwd.includes('Users'))
  );
}

function getDataDir(): string {
  const isServerless = detectServerless();
  // Always use /tmp in serverless - it's the only writable location
  if (isServerless) {
    console.log('[STORAGE] Serverless environment detected, using /tmp for data storage');
    return path.join('/tmp', 'automation-data');
  }
  return path.join(process.cwd(), 'data');
}

const DATA_DIR = getDataDir();
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');
const PLANS_FILE = path.join(DATA_DIR, 'plans.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SCHEDULES_FILE = path.join(DATA_DIR, 'schedules.json');
const AGENT_OUTPUTS_FILE = path.join(DATA_DIR, 'agent-outputs.json');
const REMINDERS_FILE = path.join(DATA_DIR, 'reminders.json');
const IN_APP_REMINDERS_FILE = path.join(DATA_DIR, 'in-app-reminders.json');

// Initialize data directory and files
async function ensureDataDir() {
  const isServerless = detectServerless();
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });

    // Create empty JSON files if they don't exist
    for (const file of [TASKS_FILE, PLANS_FILE, PROJECTS_FILE, USERS_FILE, SCHEDULES_FILE, AGENT_OUTPUTS_FILE, REMINDERS_FILE, IN_APP_REMINDERS_FILE]) {
      try {
        await fs.access(file);
      } catch {
        await fs.writeFile(file, '[]');
      }
    }
  } catch (error: any) {
    // In serverless, if /tmp fails, log but don't throw - we'll handle gracefully
    if (isServerless && (error.code === 'EROFS' || error.message?.includes('read-only'))) {
      console.warn('Read-only filesystem detected in serverless environment.');
      console.warn('Data will not persist. Please migrate to Supabase for production storage.');
      // Return empty arrays for reads, and log writes (data won't persist)
      return;
    }
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
  const isServerless = detectServerless();
  await ensureDataDir();
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error: any) {
    // Handle read-only filesystem in serverless
    if (error.code === 'EROFS' || error.message?.includes('read-only')) {
      const errorMsg = `[STORAGE] Cannot write to ${filePath}: Read-only filesystem. ` +
        `This is expected in serverless environments. Data will not persist between invocations. ` +
        `Please migrate to Supabase for persistent storage in production.`;
      console.warn(errorMsg);
      // Don't throw - allow the app to continue (data just won't persist)
      // In serverless, /tmp is writable but cleared between invocations
      return;
    }
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

// Project operations
export const projectStorage = {
  getAll: (): Promise<Project[]> => readFile<Project>(PROJECTS_FILE),
  byId: async (id: string): Promise<Project | undefined> => {
    const projects = await readFile<Project>(PROJECTS_FILE);
    return projects.find(p => p.id === id);
  },
  save: async (project: Project): Promise<void> => {
    const projects = await readFile<Project>(PROJECTS_FILE);
    const index = projects.findIndex(p => p.id === project.id);
    if (index >= 0) projects[index] = project;
    else projects.push(project);
    await writeFile(PROJECTS_FILE, projects);
  },
  delete: async (id: string): Promise<void> => {
    const projects = await readFile<Project>(PROJECTS_FILE);
    await writeFile(PROJECTS_FILE, projects.filter(p => p.id !== id));
  },
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

// Reminder operations
export const reminderStorage = {
  getAll: (): Promise<Reminder[]> => readFile<Reminder>(REMINDERS_FILE),
  byId: async (id: string): Promise<Reminder | undefined> => {
    const reminders = await readFile<Reminder>(REMINDERS_FILE);
    return reminders.find((reminder) => reminder.id === id);
  },
  save: async (reminder: Reminder): Promise<void> => {
    const reminders = await readFile<Reminder>(REMINDERS_FILE);
    const index = reminders.findIndex((existing) => existing.id === reminder.id);
    if (index >= 0) {
      reminders[index] = reminder;
    } else {
      reminders.push(reminder);
    }
    await writeFile(REMINDERS_FILE, reminders);
  },
  delete: async (id: string): Promise<void> => {
    const reminders = await readFile<Reminder>(REMINDERS_FILE);
    const filtered = reminders.filter((reminder) => reminder.id !== id);
    await writeFile(REMINDERS_FILE, filtered);
  },
};

export const inAppReminderStorage = {
  getAll: (): Promise<InAppReminder[]> => readFile<InAppReminder>(IN_APP_REMINDERS_FILE),
  byId: async (id: string): Promise<InAppReminder | undefined> => {
    const reminders = await readFile<InAppReminder>(IN_APP_REMINDERS_FILE);
    return reminders.find((reminder) => reminder.id === id);
  },
  save: async (reminder: InAppReminder): Promise<void> => {
    const reminders = await readFile<InAppReminder>(IN_APP_REMINDERS_FILE);
    const index = reminders.findIndex((existing) => existing.id === reminder.id);
    if (index >= 0) {
      reminders[index] = reminder;
    } else {
      reminders.push(reminder);
    }
    await writeFile(IN_APP_REMINDERS_FILE, reminders);
  },
  delete: async (id: string): Promise<void> => {
    const reminders = await readFile<InAppReminder>(IN_APP_REMINDERS_FILE);
    const filtered = reminders.filter((reminder) => reminder.id !== id);
    await writeFile(IN_APP_REMINDERS_FILE, filtered);
  },
};
