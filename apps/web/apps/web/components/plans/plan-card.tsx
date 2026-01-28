"use client";

import { motion } from "framer-motion";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Battery, CheckSquare, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { Plan } from "@/lib/models/task";

interface PlanCardProps {
  plan: Plan;
  progress: number;
  energyLevel?: 'low' | 'medium' | 'high';
  priority?: 'low' | 'medium' | 'high';
  taskCount: number;
  isActive?: boolean;
  onClick?: () => void;
}

const energyColors = {
  low: 'text-red-400',
  medium: 'text-orange-400',
  high: 'text-green-400',
};

const priorityColors = {
  low: 'text-gray-400',
  medium: 'text-orange-400',
  high: 'text-red-400',
};

export function PlanCard({
  plan,
  progress,
  energyLevel,
  priority,
  taskCount,
  isActive = false,
  onClick,
}: PlanCardProps) {
  const getGradient = (): 'blue-purple' | 'teal-purple' | 'blue-teal' | 'purple-pink' => {
    if (progress >= 70) return 'teal-purple';
    if (progress >= 50) return 'blue-purple';
    return 'blue-teal';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "cursor-pointer transition-all",
          isActive && "ring-2 ring-blue-500 shadow-lg shadow-blue-500/20"
        )}
        onClick={onClick}
      >
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-md bg-primary/10">
              <Target className="h-4 w-4 text-primary" />
            </div>
            {plan.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          {/* Circular Progress */}
          <CircularProgress
            value={progress}
            size={140}
            strokeWidth={10}
            gradient={getGradient()}
            showPercentage={true}
          />
          
          {/* Details */}
          <div className="w-full space-y-3">
            {energyLevel && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Battery className={cn("h-4 w-4", energyColors[energyLevel])} />
                  <span className="text-sm text-gray-400">Energy Level:</span>
                </div>
                <span className={cn("text-sm font-medium capitalize", energyColors[energyLevel])}>
                  {energyLevel}
                </span>
              </div>
            )}
            
            {priority && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className={cn("h-4 w-4", priorityColors[priority])} />
                  <span className="text-sm text-gray-400">Priority:</span>
                </div>
                <span className={cn("text-sm font-medium capitalize", priorityColors[priority])}>
                  {priority}
                </span>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400">Tasks:</span>
              </div>
              <span className="text-sm font-medium text-white">
                {taskCount} {taskCount === 1 ? 'Task' : 'Tasks'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
