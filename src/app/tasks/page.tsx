"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "@/components/layout/layout";
import TaskCard from "@/components/tasks/task-card";
import { TaskCreationForm } from "@/components/tasks/task-creation-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, LogIn, UserPlus } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth/auth-provider";

interface Task {
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
}

export default function TasksPage() {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks");
        if (!res.ok) {
          if (res.status === 401) {
            setTasks([]);
            return;
          }
          setTasks([]);
          return;
        }
        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);
      } catch {
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [user, authLoading]);

  const handleTaskCreated = async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setTasks(data);
      }
    } catch {
      /* ignore */
    }
  };

  if (!authLoading && !user) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center px-2">
          <Card className="max-w-md w-full bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-600/20 border-2 border-blue-500/30">
            <CardHeader className="text-center px-4 sm:px-6">
              <div className="inline-flex p-3 rounded-full bg-white/10 mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-white">
                Sign in to view tasks
              </CardTitle>
              <CardDescription className="text-white/80 text-sm sm:text-base">
                Create an account or sign in to manage your tasks.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6">
              <Link href="/auth/signup" className="block">
                <Button
                  size="lg"
                  className="w-full min-h-[44px] bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
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

  const tasksArray = Array.isArray(tasks) ? tasks : [];

  return (
    <Layout>
      <AnimatePresence>
        {showTaskForm && (
          <TaskCreationForm
            onClose={() => setShowTaskForm(false)}
            onTaskCreated={handleTaskCreated}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Tasks</h1>
          <Button onClick={() => setShowTaskForm(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading tasks...
          </div>
        ) : tasksArray.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tasksArray.map((task) => (
              <Link key={task.id} href={`/tasks/${task.id}`}>
                <TaskCard
                  task={task}
                  status="summary"
                  onStartTask={() => {}}
                />
              </Link>
            ))}
          </div>
        ) : (
          <Card className="text-center py-16">
            <CardTitle>No tasks yet</CardTitle>
            <CardDescription className="mt-2">
              Talk your mind—type or speak what you want, and we’ll turn it into tasks.
            </CardDescription>
            <Button
              className="mt-6 w-full sm:w-auto"
              onClick={() => setShowTaskForm(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Talk your mind
            </Button>
          </Card>
        )}
      </div>
    </Layout>
  );
}
