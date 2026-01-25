"use client";

import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Clock, AlertCircle, Brain } from "lucide-react";

interface ScheduleTimeBlockProps {
  startTime: Date;
  endTime: Date;
  title: string;
  duration: number; // in minutes
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  focusLevel?: 'shallow' | 'moderate' | 'high' | 'intense' | 'mindful';
  type?: 'work' | 'break' | 'free';
  taskId?: string;
}

const priorityColors = {
  urgent: 'bg-red-500/20 border-red-500 text-red-400',
  high: 'bg-red-500/20 border-red-500 text-red-400',
  medium: 'bg-orange-500/20 border-orange-500 text-orange-400',
  low: 'bg-gray-500/20 border-gray-500 text-gray-400',
};

const focusLabels = {
  intense: 'Intense',
  high: 'High',
  moderate: 'Moderate',
  mindful: 'Mindful',
  shallow: 'Shallow',
};

export function ScheduleTimeBlock({
  startTime,
  endTime,
  title,
  duration,
  priority,
  focusLevel,
  type = 'work',
  taskId,
}: ScheduleTimeBlockProps) {
  const isBreak = type === 'break';
  const isFree = type === 'free';
  
  const getGradientClass = () => {
    if (isBreak || isFree) return 'bg-gray-800/50';
    if (priority === 'urgent' || priority === 'high') return 'bg-gradient-to-r from-blue-600/20 to-purple-600/20';
    if (priority === 'medium') return 'bg-gradient-to-r from-cyan-600/20 to-blue-600/20';
    return 'bg-gradient-to-r from-purple-600/20 to-pink-600/20';
  };

  return (
    <div
      className={cn(
        "p-4 rounded-lg border transition-smooth",
        getGradientClass(),
        !isBreak && !isFree && "hover:opacity-80"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-white">
              {format(startTime, 'h:mm a')}
            </span>
            {!isBreak && !isFree && (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-400">{title}</span>
              </>
            )}
            {isBreak && (
              <span className="text-sm text-gray-400">{title}</span>
            )}
            {isFree && (
              <span className="text-sm text-gray-400">{format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')} Free Time</span>
            )}
          </div>
          
          {!isBreak && !isFree && (
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                <span>{duration} {duration === 1 ? 'hr' : 'hrs'}</span>
              </div>
              
              {priority && (
                <span className={cn(
                  "px-2 py-0.5 rounded text-xs font-medium border",
                  priorityColors[priority]
                )}>
                  {priority === 'urgent' ? 'Urgent' : priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                </span>
              )}
              
              {focusLevel && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Brain className="h-3 w-3" />
                  <span>Focus: {focusLabels[focusLevel]}</span>
                </div>
              )}
            </div>
          )}
          
          {isBreak && (
            <span className="text-xs text-gray-500">Time to Recharge</span>
          )}
        </div>
      </div>
    </div>
  );
}
