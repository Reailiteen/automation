import type { Task, Project, TaskKind } from "../models/task";

const KINDS: TaskKind[] = ["reminder", "todo", "habit", "daily"];

function defaultRecurrencePerWeek(kind: TaskKind): number {
  switch (kind) {
    case "daily":
      return 7;
    case "habit":
      return 3;
    case "reminder":
    case "todo":
    default:
      return 1;
  }
}

/** Current ISO week (Mon–Sun) bounds. */
export function getWeekBounds(): { start: Date; end: Date } {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const start = new Date(now);
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function inWeek(d: Date, start: Date, end: Date): boolean {
  const t = new Date(d).getTime();
  return t >= start.getTime() && t <= end.getTime();
}

export interface PressureResult {
  totalHours: number;
  projectHours: number;
  nonProjectHours: number;
  itemCount: number;
  /** Non-project tasks + projects. Higher = more fragmented. */
  fragmentation: "low" | "medium" | "high";
  byKind: Record<TaskKind, { count: number; hours: number }>;
  projects: { id: string; title: string; weeklyHours: number }[];
}

/**
 * Compute weekly pressure: hours from non-project tasks (reminder, todo, habit, daily)
 * plus project weekly allocations. Tasks in projects don't add time—project hours count.
 * More hours + more split (items) = harder.
 */
export function computePressure(tasks: Task[], projects: Project[]): PressureResult {
  const { start, end } = getWeekBounds();
  const byKind: Record<TaskKind, { count: number; hours: number }> = {
    reminder: { count: 0, hours: 0 },
    todo: { count: 0, hours: 0 },
    habit: { count: 0, hours: 0 },
    daily: { count: 0, hours: 0 },
  };

  let nonProjectMinutes = 0;
  let nonProjectItemCount = 0;

  for (const t of tasks) {
    if (t.status === "cancelled") continue;
    const kind = (t.kind ?? "todo") as TaskKind;
    if (!KINDS.includes(kind)) continue;
    if (t.projectId) continue;

    const perWeek = t.recurrencePerWeek ?? defaultRecurrencePerWeek(kind);
    const minutes = t.estimatedTime * perWeek;
    byKind[kind].hours += minutes / 60;
    byKind[kind].count += 1;
    nonProjectMinutes += minutes;
    nonProjectItemCount += 1;
  }

  let projectHours = 0;
  for (const p of projects) {
    projectHours += p.weeklyHours;
  }

  const nonProjectHours = nonProjectMinutes / 60;
  const totalHours = nonProjectHours + projectHours;
  const itemCount = nonProjectItemCount + projects.length;

  let fragmentation: "low" | "medium" | "high" = "low";
  if (totalHours > 0) {
    const itemsPer10h = itemCount / (totalHours / 10);
    if (itemsPer10h >= 8 || itemCount >= 25) fragmentation = "high";
    else if (itemsPer10h >= 4 || itemCount >= 12) fragmentation = "medium";
  }

  return {
    totalHours,
    projectHours,
    nonProjectHours,
    itemCount,
    fragmentation,
    byKind,
    projects: projects.map((p) => ({ id: p.id, title: p.title, weeklyHours: p.weeklyHours })),
  };
}
