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
  isRecurring?: boolean;
  recurrencePattern?: string;
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

export interface AgentOutput {
  agentType: 'planner' | 'prioritizer' | 'scheduler' | 'execution' | 'reflection';
  timestamp: Date;
  input: any;
  output: any;
  confidence: number; // 0-1
}