"use client";

import { Task } from "@/lib/models/task";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar, Clock, Star } from "lucide-react";

const getPriorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'urgent':
      return 'border-l-red-500';
    case 'high':
      return 'border-l-orange-500';
    case 'medium':
      return 'border-l-yellow-500';
    case 'low':
      return 'border-l-green-500';
  }
};

const getFocusLevelBadge = (focusLevel: Task['focusLevel']) => {
  switch (focusLevel) {
    case 'deep':
      return 'bg-primary text-primary-foreground';
    case 'medium':
      return 'bg-secondary text-secondary-foreground';
    case 'shallow':
      return 'bg-muted text-muted-foreground';
  }
};

interface TaskCardProps {
  task: Task;
  status?: 'summary' | 'detailed';
  onStartTask?: (taskId: string) => void;
  onEditTask?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
}

const TaskCard = (
  { task, status = 'summary', onStartTask, onEditTask, onDeleteTask }
  : TaskCardProps
) => {
  const formattedTime = Math.floor(task.estimatedTime / 60) > 0
    ? `${Math.floor(task.estimatedTime / 60)}h ${task.estimatedTime % 60}m`
    : `${task.estimatedTime}m`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card className={cn(
        "h-full border-l-4", 
        getPriorityColor(task.priority)
      )}>
        <CardHeader>
          <div className="flex justify-between items-start gap-3">
            <CardTitle className="text-base font-medium leading-snug flex-1">{task.title}</CardTitle>
            <div className="flex flex-wrap items-center gap-1.5 flex-shrink-0">
              {(task.kind && task.kind !== "todo") && (
                <span className="inline-flex rounded-md px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground capitalize">
                  {task.kind}
                </span>
              )}
              <span className={cn(
                "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
                getFocusLevelBadge(task.focusLevel)
              )}>
                {task.focusLevel}
              </span>
            </div>
          </div>
          {task.description && status === 'detailed' && (
            <CardDescription className="text-sm overflow-hidden">
              <div className="line-clamp-3">
                {task.description}
              </div>
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex rounded-md px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              <span>{formattedTime}</span>
            </div>
            {task.dueDate && (
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Star size={14} />
              <span className="capitalize">{task.priority}</span>
            </div>
          </div>
        </CardContent>

        {status === 'detailed' && (
          <CardFooter className="pt-0">
            <div className="flex flex-wrap gap-2 w-full">
              {onStartTask && task.status === 'pending' && (
                <Button
                  size="sm"
                  className="flex-grow"
                  onClick={() => onStartTask(task.id)}
                >
                  Start
                </Button>
              )}
              {task.status === 'in-progress' && (
                <Button size="sm" disabled className="flex-grow">
                  In Progress
                </Button>
              )}
              {onEditTask && (
                <Button variant="outline" size="sm" onClick={() => onEditTask(task.id)}>
                  Edit
                </Button>
              )}
              {onDeleteTask && (
                <Button variant="destructive" size="sm" onClick={() => onDeleteTask(task.id)}>
                  Delete
                </Button>
              )}
            </div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

export default TaskCard;