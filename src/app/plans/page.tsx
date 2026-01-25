"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/layout";
import { PlanCard } from "@/components/plans/plan-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
import { Plan } from "@/lib/models/task";

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch plans from API
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/plans');
        const plansData = await response.json();
        setPlans(plansData);
      } catch (error) {
        console.error('Error fetching plans:', error);
        // Mock data for now
        setPlans([
          {
            id: '1',
            title: 'Fitness Goals',
            description: 'Get in shape and build healthy habits',
            status: 'active',
            tasks: ['1', '2', '3'],
            createdAt: new Date(),
            updatedAt: new Date(),
            goal: 'Achieve fitness goals',
            constraints: {},
          },
          {
            id: '2',
            title: 'Work Projects',
            description: 'Complete important work projects',
            status: 'active',
            tasks: ['4', '5', '6', '7', '8'],
            createdAt: new Date(),
            updatedAt: new Date(),
            goal: 'Complete work projects',
            constraints: {},
          },
          {
            id: '3',
            title: 'Learning',
            description: 'Learn new skills and technologies',
            status: 'active',
            tasks: ['9', '10'],
            createdAt: new Date(),
            updatedAt: new Date(),
            goal: 'Expand knowledge',
            constraints: {},
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const planData = [
    {
      plan: plans[0] || {
        id: '1',
        title: 'Fitness Goals',
        description: 'Get in shape',
        status: 'active',
        tasks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        goal: 'Fitness',
        constraints: {},
      },
      progress: 65,
      energyLevel: 'high' as const,
      taskCount: 3,
    },
    {
      plan: plans[1] || {
        id: '2',
        title: 'Work Projects',
        description: 'Work projects',
        status: 'active',
        tasks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        goal: 'Work',
        constraints: {},
      },
      progress: 78,
      energyLevel: 'high' as const,
      priority: 'high' as const,
      taskCount: 5,
      isActive: true,
    },
    {
      plan: plans[2] || {
        id: '3',
        title: 'Learning',
        description: 'Learning',
        status: 'active',
        tasks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        goal: 'Learn',
        constraints: {},
      },
      progress: 45,
      taskCount: 2,
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
            <Target className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-white">Active Plans</h1>
        </motion.div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading plans...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {planData.map((planInfo, index) => (
              <motion.div
                key={planInfo.plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <PlanCard
                  plan={planInfo.plan}
                  progress={planInfo.progress}
                  energyLevel={planInfo.energyLevel}
                  priority={planInfo.priority}
                  taskCount={planInfo.taskCount}
                  isActive={planInfo.isActive}
                  onClick={() => console.log(`Clicked plan ${planInfo.plan.id}`)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
