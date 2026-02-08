import { Task, Plan, User, Schedule, TimeBlock } from './task';
import { ValidationResult } from './validation';

export interface BaseAgentInput {
  user: User;
  context?: any;
}

export interface BaseAgentOutput {
  result: any;
  confidence: number; // 0-1
  metadata?: Record<string, any>;
}

export interface BaseAgent<TInput extends BaseAgentInput, TOutput> {
  type: string;
  process(input: TInput): Promise<BaseAgentOutput>;
}

// Common agent input types
export interface PlannerInput extends BaseAgentInput {
  goals: string[];
  constraints?: any;
  timeframe?: {
    start: Date;
    end: Date;
  };
  confirm?: boolean;
  forceCreate?: boolean;
}

export interface PriorityFactors {
  deadlineImportance: number; // 0-1
  longTermValue: number; // 0-1
  requiredFocus: number; // 0-1
  energyCost: number; // 0-1, higher = more costly
  dependencyComplexity: number; // 0-1
  userPreference: number; // 0-1
}

export interface PrioritizationInput extends BaseAgentInput {
  tasks: Task[];
  currentContext?: {
    availableTime: number; // in minutes
    currentEnergy: 'low' | 'medium' | 'high';
    location: string;
    toolsAvailable: string[];
  };
}

export interface SchedulerInput extends BaseAgentInput {
  tasks: Task[];
  date: Date;
  existingEvents?: TimeBlock[];
  constraints?: {
    maxDeepWorkSessions?: number;
    minBreakBetweenDeepWork?: number; // in minutes
  };
}

export interface ExecutionInput extends BaseAgentInput {
  currentTask: Task;
  progress?: {
    timeSpent: number; // in minutes
    completedSteps?: string[];
    blockers?: string[];
  };
  nextSteps?: string[];
}

export interface ReflectionInput extends BaseAgentInput {
  tasks: Task[];
  completionHistory: {
    taskId: string;
    plannedTime: number;
    actualTime: number;
    quality: 'poor' | 'good' | 'excellent';
  }[];
  userFeedback?: {
    task: string;
    difficulty: 'too-easy' | 'just-right' | 'too-hard';
    enjoyment: 'hated' | 'neutral' | 'enjoyed';
  }[];
}

// Common agent output types
export interface PlannerOutput {
  plan: Plan | null;
  tasks: Task[];
  reasoning: string[];
  requiresConfirmation?: boolean;
  validation?: ValidationResult;
  duplicateItems?: any;
  draftTasks?: Partial<Task>[];
}

export interface PrioritizedTask extends Task {
  priorityScore: number;
  factors: PriorityFactors;
}

export interface PrioritizationOutput {
  tasks: PrioritizedTask[];
  reasoning: string[];
}

export interface SchedulerOutput {
  schedule: Schedule | null;
  reasoning: string[];
  validation?: ValidationResult;
}

export interface ExecutionOutput {
  nextStep: {
    action: string;
    instructions: string;
    estimatedTime: number;
  } | null;
  context: {
    relatedTasks: Task[];
    blockers: string[];
    resources: string[];
  };
  suggestions: string[];
}

export interface ReflectionOutput {
  insights: {
    patterns: string[];
    adjustments: {
      type: 'energy' | 'time' | 'priority' | 'process';
      before: any;
      after: any;
      reason: string;
    }[];
  };
  recommendations: string[];
}
