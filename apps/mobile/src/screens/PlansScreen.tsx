import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Plan } from '@automation/types';
import { planRepo, taskRepo } from '@automation/data';

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

  const calculateProgress = (plan: Plan) => {
    if (!plan.tasks || plan.tasks.length === 0) return 0;

    // Count completed tasks
    const completedTasks = plan.tasks.filter(async (taskId) => {
      const task = await taskRepo.getById(taskId);
      return task?.status === 'completed';
    }).length;

    return Math.round((completedTasks / plan.tasks.length) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'completed':
        return '#3b82f6';
      case 'draft':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading plans...</Text>
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
          plans.map((plan) => (
            <TouchableOpacity key={plan.id} style={styles.planCard}>
              <View style={styles.planHeader}>
                <Text style={styles.planTitle}>{plan.title}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(plan.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{plan.status}</Text>
                </View>
              </View>

              {plan.description && (
                <Text style={styles.planDescription} numberOfLines={3}>
                  {plan.description}
                </Text>
              )}

              <View style={styles.planMeta}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Tasks</Text>
                  <Text style={styles.metaValue}>
                    {plan.tasks?.length || 0}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Progress</Text>
                  <Text style={styles.metaValue}>
                    {calculateProgress(plan)}%
                  </Text>
                </View>
              </View>

              {plan.createdAt && (
                <Text style={styles.planDate}>
                  Created {new Date(plan.createdAt).toLocaleDateString()}
                </Text>
              )}
            </TouchableOpacity>
          ))
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
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  loadingText: {
    color: '#a0a0a0',
    textAlign: 'center',
    marginTop: 100,
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
  planCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  planDescription: {
    fontSize: 14,
    color: '#a0a0a0',
    lineHeight: 20,
    marginBottom: 16,
  },
  planMeta: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  planDate: {
    fontSize: 12,
    color: '#6b7280',
  },
});
