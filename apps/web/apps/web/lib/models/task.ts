export type TaskKind = "reminder" | "todo" | "habit" | "daily";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  estimatedTime: number;
  actualTime?: number;
  focusLevel: "shallow" | "medium" | "deep";
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  parentTaskId?: string;
  subtasks: string[];
  dependencies: string[];
  tags: string[];
  energyRequirement: "low" | "medium" | "high";
  context: string;
  isRecurring?: boolean;
  recurrencePattern?: string;
  kind?: TaskKind;
  projectId?: string;
  recurrencePerWeek?: number;
}

export interface Plan {
  id: string;
  title: string;
  description: string;
  status: "draft" | "active" | "completed" | "archived";
  tasks: string[];
  createdAt: Date;
  updatedAt: Date;
  startDate?: Date;
  endDate?: Date;
  goal: string;
}
