import { Plan, Task } from "@/lib/models/task";

export interface SimilarItem {
  item: Task | Plan;
  type: "task" | "plan";
  similarity: number;
  reason: string;
}
