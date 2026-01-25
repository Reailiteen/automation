"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Layout from "@/components/layout/layout";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Flame, 
  Brain, 
  Battery, 
  CheckSquare, 
  FolderTree, 
  Tag, 
  Edit, 
  CheckCircle, 
  Archive,
  Info,
  Clock
} from "lucide-react";
import { Task } from "@/lib/models/task";

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params.id as string;
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(75);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`/api/tasks/${taskId}`);
        if (response.ok) {
          const taskData = await response.json();
          setTask(taskData);
          // Calculate progress based on subtasks
          if (taskData.subtasks && taskData.subtasks.length > 0) {
            // Mock: assume 3 out of 4 subtasks completed
            const completed = 3;
            const total = taskData.subtasks.length;
            setProgress((completed / total) * 100);
          }
        }
      } catch (error) {
        console.error('Error fetching task:', error);
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  // Mock task data if API fails
  const mockTask: Task = {
    id: taskId,
    title: "Complete Project Report",
    description: "Finish the comprehensive project report with all analysis and recommendations",
    status: "in-progress",
    priority: "high",
    estimatedTime: 120,
    actualTime: 90,
    focusLevel: "deep",
    dueDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    subtasks: ["1", "2", "3", "4"],
    dependencies: [],
    tags: ["work", "priority", "urgent"],
    energyRequirement: "medium",
    context: "work",
  };

  const currentTask = task || mockTask;

  const subtasks = [
    { id: "1", title: "Research data", completed: true },
    { id: "2", title: "Create outline", completed: true },
    { id: "3", title: "Write draft", completed: false },
    { id: "4", title: "Review & edit", completed: false },
  ];

  const aiInsights = [
    "Focus on analysis of recent data trends.",
    "Ensure the report is concise and clear.",
    "Take a short break if you feel fatigued.",
  ];

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-12 text-center text-gray-400">
          Loading task...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-3">{currentTask.title}</h1>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
              In Progress
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Details */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Flame className="h-5 w-5 text-red-400" />
                  <span className="text-sm text-gray-400">Priority:</span>
                  <span className="px-2 py-1 rounded text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                    High
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Brain className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-400">Focus Level:</span>
                  <span className="px-2 py-1 rounded text-sm font-medium bg-gray-700 text-gray-300 border border-gray-600">
                    Deep Work
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Battery className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-400">Energy Required:</span>
                  <span className="px-2 py-1 rounded text-sm font-medium bg-gray-700 text-gray-300 border border-gray-600">
                    Medium
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Time Tracking */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Info className="h-5 w-5 text-gray-400" />
                  Time Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Estimated: {currentTask.estimatedTime} hours</span>
                  <span className="text-sm text-gray-400">Actual: {currentTask.actualTime || 0}h {((currentTask.actualTime || 0) % 1 * 60).toFixed(0)}m</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
                    style={{ width: `${(currentTask.actualTime || 0) / currentTask.estimatedTime * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Subtasks */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <CheckSquare className="h-5 w-5 text-gray-400" />
                  Subtasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center gap-3">
                      <div className={`
                        w-5 h-5 rounded border-2 flex items-center justify-center
                        ${subtask.completed 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-gray-600'
                        }
                      `}>
                        {subtask.completed && (
                          <CheckCircle className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className={`text-sm ${subtask.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dependencies */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <FolderTree className="h-5 w-5 text-gray-400" />
                  Dependencies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">No dependencies</p>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Tag className="h-5 w-5 text-gray-400" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentTask.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete
              </Button>
              <Button variant="outline" className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800">
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress Circle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-8 flex flex-col items-center justify-center">
                  <CircularProgress
                    value={progress}
                    size={180}
                    strokeWidth={12}
                    gradient="teal-purple"
                    showPercentage={true}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">AI Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {aiInsights.map((insight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
