import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, Plan, User, Schedule, AgentOutput, Project, Reminder, InAppReminder } from '@automation/types';

// AsyncStorage keys
const TASKS_KEY = '@automation:tasks';
const PLANS_KEY = '@automation:plans';
const PROJECTS_KEY = '@automation:projects';
const USERS_KEY = '@automation:users';
const SCHEDULES_KEY = '@automation:schedules';
const AGENT_OUTPUTS_KEY = '@automation:agent-outputs';
const REMINDERS_KEY = '@automation:reminders';
const IN_APP_REMINDERS_KEY = '@automation:in-app-reminders';

// Generic read/write functions
async function readData<T>(key: string): Promise<T[]> {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading ${key}:`, error);
    return [];
  }
}

async function writeData<T>(key: string, data: T[]): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error writing ${key}:`, error);
  }
}

// Task operations - matching the Node.js storage API exactly
export const taskStorage = {
  getAll: (): Promise<Task[]> => readData<Task>(TASKS_KEY),

  byId: async (id: string): Promise<Task | undefined> => {
    const tasks = await readData<Task>(TASKS_KEY);
    return tasks.find((task) => task.id === id);
  },

  byPlan: async (planId: string): Promise<Task[]> => {
    const plans = await readData<Plan>(PLANS_KEY);
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return [];

    const tasks = await readData<Task>(TASKS_KEY);
    return tasks.filter((task) => plan.tasks.includes(task.id));
  },

  save: async (task: Task): Promise<void> => {
    const tasks = await readData<Task>(TASKS_KEY);
    const index = tasks.findIndex((t) => t.id === task.id);

    if (index >= 0) {
      tasks[index] = task;
    } else {
      tasks.push(task);
    }

    await writeData(TASKS_KEY, tasks);
  },

  delete: async (id: string): Promise<void> => {
    const tasks = await readData<Task>(TASKS_KEY);
    const filtered = tasks.filter((task) => task.id !== id);
    await writeData(TASKS_KEY, filtered);
  },
};

// Plan operations
export const planStorage = {
  getAll: (): Promise<Plan[]> => readData<Plan>(PLANS_KEY),

  byId: async (id: string): Promise<Plan | undefined> => {
    const plans = await readData<Plan>(PLANS_KEY);
    return plans.find((plan) => plan.id === id);
  },

  save: async (plan: Plan): Promise<void> => {
    const plans = await readData<Plan>(PLANS_KEY);
    const index = plans.findIndex((p) => p.id === plan.id);

    if (index >= 0) {
      plans[index] = plan;
    } else {
      plans.push(plan);
    }

    await writeData(PLANS_KEY, plans);
  },

  delete: async (id: string): Promise<void> => {
    const plans = await readData<Plan>(PLANS_KEY);
    const filtered = plans.filter((plan) => plan.id !== id);
    await writeData(PLANS_KEY, filtered);
  },
};

// Project operations
export const projectStorage = {
  getAll: (): Promise<Project[]> => readData<Project>(PROJECTS_KEY),

  byId: async (id: string): Promise<Project | undefined> => {
    const projects = await readData<Project>(PROJECTS_KEY);
    return projects.find((p) => p.id === id);
  },

  save: async (project: Project): Promise<void> => {
    const projects = await readData<Project>(PROJECTS_KEY);
    const index = projects.findIndex((p) => p.id === project.id);

    if (index >= 0) {
      projects[index] = project;
    } else {
      projects.push(project);
    }

    await writeData(PROJECTS_KEY, projects);
  },

  delete: async (id: string): Promise<void> => {
    const projects = await readData<Project>(PROJECTS_KEY);
    const filtered = projects.filter((p) => p.id !== id);
    await writeData(PROJECTS_KEY, filtered);
  },
};

// User operations
export const userStorage = {
  getAll: (): Promise<User[]> => readData<User>(USERS_KEY),

  byId: async (id: string): Promise<User | undefined> => {
    const users = await readData<User>(USERS_KEY);
    return users.find((user) => user.id === id);
  },

  save: async (user: User): Promise<void> => {
    const users = await readData<User>(USERS_KEY);
    const index = users.findIndex((u) => u.id === user.id);

    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }

    await writeData(USERS_KEY, users);
  },
};

// Schedule operations
export const scheduleStorage = {
  getAll: (): Promise<Schedule[]> => readData<Schedule>(SCHEDULES_KEY),

  byDate: async (date: Date): Promise<Schedule | undefined> => {
    const schedules = await readData<Schedule>(SCHEDULES_KEY);
    return schedules.find((schedule) =>
      new Date(schedule.date).toDateString() === date.toDateString()
    );
  },

  save: async (schedule: Schedule): Promise<void> => {
    const schedules = await readData<Schedule>(SCHEDULES_KEY);
    const index = schedules.findIndex((s) => s.id === schedule.id);

    if (index >= 0) {
      schedules[index] = schedule;
    } else {
      schedules.push(schedule);
    }

    await writeData(SCHEDULES_KEY, schedules);
  },
};

// Agent output operations
export const agentOutputStorage = {
  getAll: (): Promise<AgentOutput[]> => readData<AgentOutput>(AGENT_OUTPUTS_KEY),

  save: async (output: AgentOutput): Promise<void> => {
    const outputs = await readData<AgentOutput>(AGENT_OUTPUTS_KEY);
    outputs.push(output);
    await writeData(AGENT_OUTPUTS_KEY, outputs);
  },
};

// Reminder operations
export const reminderStorage = {
  getAll: (): Promise<Reminder[]> => readData<Reminder>(REMINDERS_KEY),

  byId: async (id: string): Promise<Reminder | undefined> => {
    const reminders = await readData<Reminder>(REMINDERS_KEY);
    return reminders.find((reminder) => reminder.id === id);
  },

  save: async (reminder: Reminder): Promise<void> => {
    const reminders = await readData<Reminder>(REMINDERS_KEY);
    const index = reminders.findIndex((existing) => existing.id === reminder.id);

    if (index >= 0) {
      reminders[index] = reminder;
    } else {
      reminders.push(reminder);
    }

    await writeData(REMINDERS_KEY, reminders);
  },

  delete: async (id: string): Promise<void> => {
    const reminders = await readData<Reminder>(REMINDERS_KEY);
    const filtered = reminders.filter((reminder) => reminder.id !== id);
    await writeData(REMINDERS_KEY, filtered);
  },
};

export const inAppReminderStorage = {
  getAll: (): Promise<InAppReminder[]> => readData<InAppReminder>(IN_APP_REMINDERS_KEY),

  byId: async (id: string): Promise<InAppReminder | undefined> => {
    const reminders = await readData<InAppReminder>(IN_APP_REMINDERS_KEY);
    return reminders.find((reminder) => reminder.id === id);
  },

  save: async (reminder: InAppReminder): Promise<void> => {
    const reminders = await readData<InAppReminder>(IN_APP_REMINDERS_KEY);
    const index = reminders.findIndex((existing) => existing.id === reminder.id);

    if (index >= 0) {
      reminders[index] = reminder;
    } else {
      reminders.push(reminder);
    }

    await writeData(IN_APP_REMINDERS_KEY, reminders);
  },

  delete: async (id: string): Promise<void> => {
    const reminders = await readData<InAppReminder>(IN_APP_REMINDERS_KEY);
    const filtered = reminders.filter((reminder) => reminder.id !== id);
    await writeData(IN_APP_REMINDERS_KEY, filtered);
  },
};
