/** Task taxonomy: reminders, todos, habits, dailies. Tasks can also belong to a project. */
import { ValidationResult } from './validation';
export type TaskKind = 'reminder' | 'todo' | 'habit' | 'daily';
export type ReminderChannel = 'email' | 'inApp' | 'push';
export type ReminderStatus = 'pending' | 'sent' | 'partial' | 'cancelled' | 'failed';
export type InAppReminderStatus = 'unread' | 'read' | 'archived';

export interface ReminderAttempt {
  channel: ReminderChannel;
  status: 'sent' | 'failed' | 'skipped';
  message: string;
  timestamp: Date;
}

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  message: string;
  dueAt: Date;
  channels: ReminderChannel[];
  status: ReminderStatus;
  lastSentAt?: Date;
  sentChannels: ReminderChannel[];
  failedChannels: ReminderChannel[];
  attempts: ReminderAttempt[];
  recipientEmail?: string;
  pushTokens: string[];
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface InAppReminder {
  id: string;
  userId: string;
  reminderId?: string;
  title: string;
  message: string;
  status: InAppReminderStatus;
  deepLink?: string;
  metadata?: Record<string, unknown>;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedTime: number; // in minutes
  actualTime?: number; // in minutes
  focusLevel: 'shallow' | 'medium' | 'deep';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  parentTaskId?: string;
  subtasks: string[]; // Task IDs
  dependencies: string[]; // Task IDs
  tags: string[];
  energyRequirement: 'low' | 'medium' | 'high';
  context: string; // e.g., "home", "work", "anywhere"
  userId?: string;
  isRecurring?: boolean;
  recurrencePattern?: string;
  /** reminder | todo | habit | daily. Default 'todo'. */
  kind?: TaskKind;
  /** If set, task belongs to a project; its hours don't add to pressure (project's weeklyHours count instead). */
  projectId?: string;
  /** Times per week for habit/daily. Default: reminder/todo 1, daily 7, habit 3. */
  recurrencePerWeek?: number;
}

/** Project: fixed weekly hours, flexible (no specific time/day). Tasks inside describe the allocation. */
export interface Project {
  id: string;
  title: string;
  description?: string;
  /** Hours per week committed to this project. Counted once in pressure; task hours inside do not add. */
  weeklyHours: number;
  taskIds: string[]; // Task IDs that belong to this project
  createdAt: Date;
  updatedAt: Date;
}

export interface Plan {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  tasks: string[]; // Task IDs
  createdAt: Date;
  updatedAt: Date;
  startDate?: Date;
  endDate?: Date;
  goal: string;
  constraints: {
    maxDailyTasks?: number;
    maxDeepWorkSessions?: number;
    requiredBreakTime?: number; // in minutes
    timeConstraints?: TimeConstraint[];
  };
  userId?: string;
}

export interface TimeConstraint {
  day: number; // 0-6 (Sunday-Saturday)
  start: string; // HH:MM format
  end: string; // HH:MM format
  type: 'blocked' | 'preferred' | 'optional';
}

export interface User {
  id: string;
  name: string;
  email: string;
  preferences: {
    workingHours: TimeConstraint[];
    energyProfile: EnergyProfile;
    taskBreakingPreference: 'automatic' | 'manual';
    schedulingStyle: 'flexible' | 'structured';
    notificationSettings: {
      taskReminders: boolean;
      scheduleChanges: boolean;
      dailySummary: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface EnergyProfile {
  peakHours: TimeConstraint[];
  mediumHours: TimeConstraint[];
  lowHours: TimeConstraint[];
  recoveryTime: number; // in minutes between deep sessions
}

export interface Schedule {
  id: string;
  date: Date; // Date without time
  tasks: ScheduledTask[];
  notes: string;
  energyProfile: EnergyProfile;
  constraints: {
    maxTasks: number;
    maxDeepWorkSessions: number;
  };
  validation?: ValidationResult;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScheduledTask {
  taskId: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  status: 'scheduled' | 'in-progress' | 'completed' | 'skipped';
  location?: string;
  context?: string;
}

/** Generic calendar/time block used for conflict detection and scheduling */
export interface TimeBlock {
  start: Date;
  end: Date;
  type: 'work' | 'break' | 'meeting' | 'event';
  taskId?: string;
  title?: string;
  location?: string;
}

export interface AgentOutput {
  agentType: 'planner' | 'prioritizer' | 'scheduler' | 'execution' | 'reflection';
  timestamp: Date;
  input: any;
  output: any;
  confidence: number; // 0-1
}
