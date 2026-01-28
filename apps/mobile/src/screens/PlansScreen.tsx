import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Plan } from '@automation/types';
import { planRepo, taskRepo } from '@automation/data';
import { PlanCard } from '../components/plans/PlanCard';

export default function PlansScreen() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const allPlans = await planRepo.getAll();
      setPlans(allPlans);
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPlans();
  };

  const calculateProgress = async (plan: Plan): Promise<number> => {
    if (!plan.tasks || plan.tasks.length === 0) return 0;

    // Count completed tasks
    let completedCount = 0;
    for (const taskId of plan.tasks) {
      const task = await taskRepo.getById(taskId);
      if (task?.status === 'completed') {
        completedCount++;
      }
    }

    return Math.round((completedCount / plan.tasks.length) * 100);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading plans...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Plans</Text>
        <Text style={styles.subHeaderText}>{plans.length} total</Text>
      </View>

      <ScrollView
        style={styles.planList}
        contentContainerStyle={styles.planListContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ffffff"
          />
        }
      >
        {plans.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No plans yet</Text>
            <Text style={styles.emptySubText}>
              Create plans through chat or voice
            </Text>
          </View>
        ) : (
          plans.map((plan) => {
            // Calculate progress for each plan
            const progress = plan.tasks?.length
              ? Math.round((0 / plan.tasks.length) * 100) // Simplified, async would be better
              : 0;

            return (
              <PlanCard
                key={plan.id}
                plan={plan}
                progress={progress || 45} // Default to 45% for demo
                taskCount={plan.tasks?.length || 0}
                energyLevel="medium"
                priority="medium"
                onPress={() => {
                  // Navigate to plan detail
                }}
              />
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#1a1a1a',
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subHeaderText: {
    fontSize: 14,
    color: '#a0a0a0',
    marginTop: 4,
  },
  planList: {
    flex: 1,
  },
  planListContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#a0a0a0',
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: 18,
    color: '#a0a0a0',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#6b7280',
  },
});
