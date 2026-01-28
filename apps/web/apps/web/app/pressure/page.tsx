"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "@/components/layout/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import type { TaskKind } from "@/lib/models/task";
import {
  Gauge,
  Clock,
  Layers,
  Sparkles,
  LogIn,
  UserPlus,
  AlertTriangle,
  CheckCircle2,
  Plus,
} from "lucide-react";

interface PressureData {
  totalHours: number;
  projectHours: number;
  nonProjectHours: number;
  itemCount: number;
  fragmentation: "low" | "medium" | "high";
  byKind: Record<TaskKind, { count: number; hours: number }>;
  projects: { id: string; title: string; weeklyHours: number }[];
}

const KIND_LABELS: Record<TaskKind, string> = {
  reminder: "Reminders",
  todo: "Todos",
  habit: "Habits",
  daily: "Dailies",
};

export default function PressurePage() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<PressureData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddProject, setShowAddProject] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectWeeklyHours, setProjectWeeklyHours] = useState(5);
  const [projectSubmitting, setProjectSubmitting] = useState(false);

  const fetchPressure = async () => {
    try {
      const res = await fetch("/api/pressure");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading || !user) {
      setLoading(false);
      return;
    }
    fetchPressure();
  }, [user, authLoading]);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;
    setProjectSubmitting(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: projectTitle.trim(),
          weeklyHours: Math.max(0, Number(projectWeeklyHours) || 0),
        }),
      });
      if (res.ok) {
        setProjectTitle("");
        setProjectWeeklyHours(5);
        setShowAddProject(false);
        setLoading(true);
        await fetchPressure();
      }
    } finally {
      setProjectSubmitting(false);
    }
  };

  if (!authLoading && !user) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center px-2">
          <Card className="max-w-md w-full bg-gradient-to-br from-amber-600/20 via-orange-600/20 to-rose-600/20 border-2 border-amber-500/30">
            <CardHeader className="text-center px-4 sm:px-6">
              <div className="inline-flex p-3 rounded-full bg-white/10 mb-4">
                <Gauge className="h-8 w-8 text-amber-400" />
              </div>
              <CardTitle className="text-xl font-bold text-white">
                Sign in to view pressure
              </CardTitle>
              <CardDescription className="text-white/80 text-sm sm:text-base">
                Track how much you've put on yourself this week.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6">
              <Link href="/auth/signup" className="block">
                <Button
                  size="lg"
                  className="w-full min-h-[44px] bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  Create Account
                </Button>
              </Link>
              <Link href="/auth/login" className="block">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full min-h-[44px] border-gray-600 text-white hover:bg-gray-800"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (authLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
        </div>
      </Layout>
    );
  }

  const totalHours = data?.totalHours ?? 0;
  const projectHours = data?.projectHours ?? 0;
  const nonProjectHours = data?.nonProjectHours ?? 0;
  const itemCount = data?.itemCount ?? 0;
  const fragmentation = data?.fragmentation ?? "low";

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-amber-500/10">
              <Gauge className="h-6 w-6 text-amber-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Weekly pressure
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            Total hours you've committed this week. More hours + more split across items = harder.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading…
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Total hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    {totalHours.toFixed(1)}h
                  </p>
                  <p className="text-xs text-gray-500 mt-1">this week</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    {itemCount}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">tasks + projects</p>
                </CardContent>
              </Card>

              <Card
                className={
                  fragmentation === "high"
                    ? "bg-rose-500/10 border-rose-500/30"
                    : fragmentation === "medium"
                      ? "bg-amber-500/10 border-amber-500/30"
                      : "bg-emerald-500/10 border-emerald-500/30"
                }
              >
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    {fragmentation === "high" ? (
                      <AlertTriangle className="h-4 w-4 text-rose-400" />
                    ) : fragmentation === "medium" ? (
                      <Gauge className="h-4 w-4 text-amber-400" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    )}
                    Fragmentation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    className={`text-xl sm:text-2xl font-bold capitalize ${
                      fragmentation === "high"
                        ? "text-rose-300"
                        : fragmentation === "medium"
                          ? "text-amber-300"
                          : "text-emerald-300"
                    }`}
                  >
                    {fragmentation}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {fragmentation === "high"
                      ? "Very split — consider batching"
                      : fragmentation === "medium"
                        ? "Moderately split"
                        : "Manageable"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Breakdown</CardTitle>
                <CardDescription>
                  Projects count their weekly allocation only; tasks inside don't add extra hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30">
                    <span className="text-sm text-cyan-300">Non-project</span>
                    <span className="text-sm font-semibold text-white">
                      {nonProjectHours.toFixed(1)}h
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/15 border border-violet-500/30">
                    <span className="text-sm text-violet-300">Projects</span>
                    <span className="text-sm font-semibold text-white">
                      {projectHours.toFixed(1)}h
                    </span>
                  </div>
                </div>

                {(data?.byKind && Object.values(data.byKind).some((v) => v.count > 0)) && (
                  <div className="pt-2 border-t border-gray-700">
                    <p className="text-sm font-medium text-gray-400 mb-2">By type</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(Object.entries(data.byKind) as [TaskKind, { count: number; hours: number }][]).map(
                        ([kind, v]) =>
                          v.count > 0 ? (
                            <div
                              key={kind}
                              className="rounded-lg bg-gray-900/50 px-3 py-2 border border-gray-700"
                            >
                              <p className="text-xs text-gray-500">{KIND_LABELS[kind]}</p>
                              <p className="text-sm font-semibold text-white">
                                {v.count} · {v.hours.toFixed(1)}h
                              </p>
                            </div>
                          ) : null
                      )}
                    </div>
                  </div>
                )}

                {data?.projects && data.projects.length > 0 && (
                  <div className="pt-2 border-t border-gray-700">
                    <p className="text-sm font-medium text-gray-400 mb-2">Projects</p>
                    <ul className="space-y-1">
                      {data.projects.map((p) => (
                        <li
                          key={p.id}
                          className="flex justify-between items-center text-sm text-gray-300"
                        >
                          <span>{p.title}</span>
                          <span className="font-medium text-white">{p.weeklyHours}h/wk</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-2 border-t border-gray-700">
                  {showAddProject ? (
                    <form onSubmit={handleAddProject} className="space-y-3">
                      <p className="text-sm font-medium text-gray-400">Add project</p>
                      <p className="text-xs text-gray-500">
                        Fixed weekly hours. Tasks inside don't add to pressure.
                      </p>
                      <input
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="Project name"
                        className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-base"
                      />
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          min={0}
                          step={0.5}
                          value={projectWeeklyHours}
                          onChange={(e) => setProjectWeeklyHours(Number(e.target.value) || 0)}
                          className="w-24 min-h-[44px] px-3 py-2 rounded-lg border border-gray-700 bg-gray-900 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-base"
                        />
                        <span className="text-sm text-gray-400">hours/week</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          disabled={!projectTitle.trim() || projectSubmitting}
                          className="min-h-[44px]"
                        >
                          {projectSubmitting ? "Adding…" : "Add"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowAddProject(false)}
                          className="min-h-[44px] border-gray-700"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddProject(true)}
                      className="border-gray-700 text-gray-400 hover:bg-gray-800"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add project
                    </Button>
                  )}
                </div>

                {totalHours === 0 && itemCount === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Sparkles className="h-10 w-10 text-amber-500/50 mb-3" />
                    <p className="text-gray-400">No pressure yet this week.</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Add tasks, habits, or projects to see your weekly load.
                    </p>
                    <Link href="/" className="mt-4">
                      <Button variant="outline" size="sm">
                        Go to dashboard
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}
