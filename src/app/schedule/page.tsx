"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/layout";
import { ScheduleTimeBlock } from "@/components/ui/schedule-time-block";
import { EnergyGauge } from "@/components/ui/energy-gauge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export default function SchedulePage() {
  const [energyLevel, setEnergyLevel] = useState<'low' | 'medium' | 'high'>('high');

  // Mock schedule data
  const schedule = [
    {
      startTime: new Date(2024, 0, 1, 9, 0),
      endTime: new Date(2024, 0, 1, 11, 0),
      title: 'Deep Work Session',
      duration: 2,
      priority: 'high' as const,
      focusLevel: 'intense' as const,
      type: 'work' as const,
    },
    {
      startTime: new Date(2024, 0, 1, 11, 0),
      endTime: new Date(2024, 0, 1, 12, 0),
      title: 'Email & Messages',
      duration: 1,
      priority: 'medium' as const,
      focusLevel: 'moderate' as const,
      type: 'work' as const,
    },
    {
      startTime: new Date(2024, 0, 1, 12, 0),
      endTime: new Date(2024, 0, 1, 13, 0),
      title: 'Lunch Break',
      duration: 1,
      type: 'break' as const,
    },
    {
      startTime: new Date(2024, 0, 1, 13, 0),
      endTime: new Date(2024, 0, 1, 15, 0),
      title: 'Execution Task',
      duration: 2,
      priority: 'urgent' as const,
      focusLevel: 'high' as const,
      type: 'work' as const,
    },
    {
      startTime: new Date(2024, 0, 1, 15, 0),
      endTime: new Date(2024, 0, 1, 16, 0),
      title: 'Reflection',
      duration: 1,
      priority: 'low' as const,
      focusLevel: 'mindful' as const,
      type: 'work' as const,
    },
    {
      startTime: new Date(2024, 0, 1, 17, 0),
      endTime: new Date(2024, 0, 1, 18, 0),
      title: 'Free Time',
      duration: 1,
      type: 'free' as const,
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3"
        >
          <div className="p-2 rounded-md bg-primary/10">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-white">Today's Schedule</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Schedule List */}
          <div className="lg:col-span-2 space-y-4">
            {schedule.map((block, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ScheduleTimeBlock
                  startTime={block.startTime}
                  endTime={block.endTime}
                  title={block.title}
                  duration={block.duration}
                  priority={block.priority}
                  focusLevel={block.focusLevel}
                  type={block.type}
                />
              </motion.div>
            ))}
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
