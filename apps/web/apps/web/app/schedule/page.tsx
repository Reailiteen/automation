"use client";

 import { useEffect, useMemo, useState } from "react";
 import { motion } from "framer-motion";
 import Layout from "@/components/layout/layout";
 import { ScheduleTimeBlock } from "@/components/ui/schedule-time-block";
 import { EnergyGauge } from "@/components/ui/energy-gauge";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Calendar, RefreshCw } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Schedule, ScheduledTask, Task, ValidationIssue } from "@automation/types";
 import { differenceInMinutes } from "date-fns";

 type BlockDetail = {
   block: ScheduledTask;
   task?: Task;
 };

 export default function SchedulePage() {
   const [schedule, setSchedule] = useState<Schedule | null>(null);
   const [blocks, setBlocks] = useState<BlockDetail[]>([]);
   const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [energyLevel, setEnergyLevel] = useState<"low" | "medium" | "high">("high");
   const [refreshing, setRefreshing] = useState(false);

   const todayKey = useMemo(() => new Date().toISOString().split("T")[0], []);

   const loadSchedule = async () => {
     setLoading(true);
     setError(null);
     try {
       const [scheduleRes, tasksRes] = await Promise.all([
         fetch(`/api/schedules?date=${todayKey}`, { credentials: "include" }),
         fetch("/api/tasks", { credentials: "include" }),
       ]);

       if (!scheduleRes.ok) {
         const message =
           scheduleRes.status === 401
             ? "Please sign in to view your schedule."
             : "Could not load schedule right now.";
         throw new Error(message);
       }

       const [scheduleData, tasksData] = await Promise.all([
         scheduleRes.json(),
         tasksRes.ok ? tasksRes.json() : [],
       ]);

       const taskMap = (tasksData as Task[]).reduce<Record<string, Task>>(
         (acc, task) => ({ ...acc, [task.id]: task }),
         {}
       );

       setSchedule(scheduleData);
       setValidationIssues(scheduleData.validation?.issues ?? []);
       setBlocks(
         (scheduleData.tasks ?? []).map((block: ScheduledTask) => ({
           block,
           task: taskMap[block.taskId],
         }))
       );
     } catch (err) {
       setError(err instanceof Error ? err.message : "Failed to load schedule");
     } finally {
       setLoading(false);
     }
   };

   const refreshSchedule = async () => {
     setRefreshing(true);
     await loadSchedule();
     setRefreshing(false);
   };

   useEffect(() => {
     loadSchedule();
   }, []);

   useEffect(() => {
     if (!validationIssues.length) {
       setEnergyLevel("high");
       return;
     }
     if (validationIssues.some((issue) => issue.severity === "error")) {
       setEnergyLevel("low");
     } else if (validationIssues.some((issue) => issue.severity === "warn")) {
       setEnergyLevel("medium");
     } else {
       setEnergyLevel("high");
     }
   }, [validationIssues]);

   const blockCount = blocks.length;
   const validationBanner = validationIssues.length > 0;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-wrap items-center gap-3 justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Today's Schedule</h1>
              <p className="text-sm text-muted-foreground">
                {loading ? "Loading…" : `${blockCount} time block${blockCount === 1 ? "" : "s"}`}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={refreshSchedule} disabled={loading || refreshing}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </motion.div>

        {error && (
          <div className="bg-red-600/20 border border-red-500 text-sm text-red-100 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {validationBanner && (
          <div className="space-y-2">
            {validationIssues.map((issue) => (
              <div
                key={issue.code}
                className={`border-l-4 px-4 py-2 ${
                  issue.severity === "error"
                    ? "bg-red-600/10 border-red-500 text-red-100"
                    : "bg-amber-600/10 border-amber-500 text-amber-100"
                }`}
              >
                <p className="text-sm font-semibold uppercase tracking-wide">
                  {issue.severity}
                </p>
                <p className="text-sm">{issue.message}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Schedule List */}
          <div className="lg:col-span-2 space-y-4">
            {loading && (
              <div className="text-center text-xs uppercase tracking-wide text-muted-foreground">
                Fetching today's schedule…
              </div>
            )}
            {!loading && blocks.length === 0 && (
              <Card className="bg-gray-900 border-gray-800 border-dashed">
                <CardContent>
                  <p className="text-sm text-white/70">
                    No schedule for today yet. Ask the AI to generate a plan!
                  </p>
                </CardContent>
              </Card>
            )}
            {blocks.map((detail, index) => {
              const { block, task } = detail;
              const durationMinutes = differenceInMinutes(block.scheduledEnd, block.scheduledStart);
              const durationHours = Math.max(Math.round((durationMinutes / 60) * 10) / 10, 0.25);
              const priority = (task?.priority ?? "medium") as "low" | "medium" | "high" | "urgent";
              const focusLevel = (task?.focusLevel ?? "moderate") as
                | "moderate"
                | "intense"
                | "mindful"
                | "high"
                | "shallow";
              const type =
                block.context?.toLowerCase().includes("break") ||
                block.context?.toLowerCase().includes("pause")
                  ? "break"
                  : block.context?.toLowerCase().includes("free")
                  ? "free"
                  : "work";

              return (
                <motion.div
                  key={`${block.taskId}-${block.scheduledStart.toISOString()}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ScheduleTimeBlock
                    startTime={new Date(block.scheduledStart)}
                    endTime={new Date(block.scheduledEnd)}
                    title={task?.title ?? "Scheduled Work"}
                    duration={durationHours}
                    priority={priority}
                    focusLevel={focusLevel}
                    type={type}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Energy Gauge */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Energy Level</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <EnergyGauge level={energyLevel} size={200} />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
