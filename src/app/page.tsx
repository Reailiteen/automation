"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/layout";
import TaskCard from "@/components/tasks/task-card";
import { TaskCreationForm } from "@/components/tasks/task-creation-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Target, Activity, Sparkles, LogIn, UserPlus } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedTime: number;
  actualTime?: number;
  focusLevel: 'shallow' | 'medium' | 'deep';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  parentTaskId?: string;
  subtasks: string[];
  dependencies: string[];
  tags: string[];
  energyRequirement: 'low' | 'medium' | 'high';
  context: string;
}

const HomePage = () => {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
    // Only fetch tasks if user is authenticated
    if (authLoading) return;
    
    if (!user) {
      setLoading(false);
      return;
    }

    // Fetch tasks from API
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        if (!response.ok) {
          if (response.status === 401) {
            // User not authenticated
            setTasks([]);
            return;
          }
          const errorData = await response.json();
          console.error('Error fetching tasks:', errorData);
          setTasks([]);
          return;
        }
        const tasksData = await response.json();
        // Ensure tasksData is an array
        if (Array.isArray(tasksData)) {
          setTasks(tasksData);
        } else {
          console.error('Invalid tasks data format:', tasksData);
          setTasks([]);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user, authLoading]);

  const handleTaskCreated = async () => {
    // Refresh tasks after creation
    if (!user) return;
    
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        console.error('Error refreshing tasks:', await response.json());
        return;
      }
      const tasksData = await response.json();
      if (Array.isArray(tasksData)) {
        setTasks(tasksData);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Ensure tasks is always an array before filtering - THIS IS THE KEY FIX
  const tasksArray = Array.isArray(tasks) ? tasks : [];
  const activeTasks = tasksArray.filter(task => task.status === 'in-progress')[0];
  // Show all tasks except the active one
  const todayTasks = tasksArray.filter(task => {
    if (!activeTasks) return true;
    return task.id !== activeTasks.id;
  });

  // Show login/signup prompt if not authenticated
  if (!authLoading && !user) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-md w-full"
          >
            <Card className="bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-600/20 border-2 border-blue-500/30">
              <CardHeader className="text-center">
                <div className="inline-flex p-3 rounded-full bg-white/10 mb-4">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-white mb-2">
                  Welcome to Your Voice-First Planning Assistant
                </CardTitle>
                <CardDescription className="text-white/80 text-base">
                  Get started by creating an account to transform your voice input into structured, actionable items.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/auth/signup" className="block">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg"
                  >
                    <UserPlus className="mr-2 h-5 w-5" />
                    Create Account
                  </Button>
                </Link>
                <Link href="/auth/login" className="block">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-gray-600 text-white hover:bg-gray-800"
                  >
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign In
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Layout>
    );
  }

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

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

      <div className="space-y-12 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-3">
            Welcome back
          </h1>
          <p className="text-muted-foreground text-lg">
            Here's what your AI assistants have prepared for today.
          </p>
        </motion.div>

        {/* Current Task Card */}
        {activeTasks ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-md bg-primary/10 text-primary">
                    <Activity className="h-5 w-5" />
                  </div>
                  Current Task
                </CardTitle>
                <CardDescription>
                  Your AI assistant scheduled this for you right now
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TaskCard task={activeTasks} status="summary" />
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-600/20 border-2 border-blue-500/30">
              <div className="text-center py-12 px-6">
                <div className="inline-flex p-3 rounded-full bg-white/10 mb-6">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-white mb-4">
                  No active task
                </CardTitle>
                <CardDescription className="mb-8 max-w-md mx-auto text-white/80 text-base">
                  Looks like there are no active tasks at the moment. Get started by creating a new plan for your AI assistant.
                </CardDescription>
                <Button
                  size="lg"
                  onClick={() => setShowTaskForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Create Your First Plan
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Quick Actions Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-white">Today's Schedule</h3>
              </div>
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Total tasks: {tasksArray.length}</span>
                    <span className="text-sm text-gray-400">Time allocated: {tasksArray.reduce((total, task) => total + (task.estimatedTime || 0), 0)}m</span>
                  </div>
                </CardContent>
              </Card>
              <Link href="/schedule" className="inline-flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                View Detailed Schedule
                <span>→</span>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.15 }}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-white">Active Plans</h3>
              </div>
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                        <span className="text-purple-400 font-semibold">N</span>
                      </div>
                      <span className="text-white font-medium">Limitless</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-400">2 Plans</span>
                      <span className="text-sm font-semibold text-cyan-400">78% Completion rate</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Link href="/plans" className="inline-flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                View All Plans
                <span>→</span>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 rounded-md bg-muted">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </div>
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="p-4 rounded-md bg-muted border-l-2 border-primary">
                    <p className="text-sm text-foreground leading-relaxed">
                      "Focus is strongest in the morning - we've scheduled your most challenging work first."
                    </p>
                  </div>
                  <div className="p-4 rounded-md bg-muted border-l-2 border-primary">
                    <p className="text-sm text-foreground leading-relaxed">
                      "Consider taking a 15-min break after your current task."
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  View Insights
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Today's Tasks List */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold">
              Today's Tasks
            </h2>
            <Button
              onClick={() => setShowTaskForm(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>
          {loading ? (
            <div className="text-center py-8">Loading tasks...</div>
          ) : todayTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {todayTasks.slice(0, 8).map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  status="summary"
                  onStartTask={() => console.log(`Starting ${task.id}`)}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardTitle>No tasks for today</CardTitle>
              <CardDescription>
                Let's create a plan and get you set up with some tasks!
              </CardDescription>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;
