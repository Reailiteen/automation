import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Task } from '@automation/types';
import { taskRepo } from '@automation/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { EnhancedTaskCard } from '../components/tasks/EnhancedTaskCard';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function DashboardScreen({ navigation }: any) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const allTasks = await taskRepo.getAll();
      setTasks(Array.isArray(allTasks) ? allTasks : []);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadTasks();
  };

  const activeTasks = tasks.filter((task) => task.status === 'in-progress')[0];
  const todayTasks = tasks.filter((task) => {
    if (!activeTasks) return true;
    return task.id !== activeTasks.id && task.status !== 'completed';
  });

  const totalTime = tasks.reduce((total, task) => total + (task.estimatedTime || 0), 0);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ffffff" />
      }
    >
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Welcome back</Text>
        <Text style={styles.welcomeSubtitle}>
          Here's what your AI assistants have prepared for today.
        </Text>
      </View>

      {/* Current Task or No Active Task */}
      {activeTasks ? (
        <Card style={styles.activeTaskCard}>
          <CardHeader>
            <View style={styles.activeTaskHeader}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityIconText}>⚡</Text>
              </View>
              <View>
                <Text style={styles.cardTitle}>Current Task</Text>
                <Text style={styles.cardDescription}>
                  Your AI assistant scheduled this for you right now
                </Text>
              </View>
            </View>
          </CardHeader>
          <CardContent>
            <EnhancedTaskCard task={activeTasks} />
          </CardContent>
        </Card>
      ) : (
        <Card variant="gradient" style={styles.noActiveTaskCard}>
          <CardContent style={styles.noActiveTaskContent}>
            <View style={styles.sparkleIcon}>
              <Text style={styles.sparkleIconText}>✨</Text>
            </View>
            <Text style={styles.noActiveTaskTitle}>No active task</Text>
            <Text style={styles.noActiveTaskDescription}>
              No active tasks right now. Tap below to talk your mind—type or speak, and we'll
              turn it into a plan.
            </Text>
            <Button
              variant="gradient"
              size="lg"
              style={styles.talkButton}
              onPress={() => navigation?.navigate('Chat')}
            >
              <Text style={styles.talkButtonText}>+ Talk your mind</Text>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions Dashboard */}
      <View style={styles.quickActions}>
        {/* Today's Schedule */}
        <View style={styles.quickActionCard}>
          <View style={styles.quickActionHeader}>
            <Text style={styles.quickActionIcon}>📅</Text>
            <Text style={styles.quickActionTitle}>Today's Schedule</Text>
          </View>
          <Card style={styles.widgetCard}>
            <CardContent style={styles.widgetContent}>
              <View style={styles.widgetRow}>
                <Text style={styles.widgetLabel}>Total tasks:</Text>
                <Text style={styles.widgetValue}>{tasks.length}</Text>
              </View>
              <View style={styles.widgetRow}>
                <Text style={styles.widgetLabel}>Time allocated:</Text>
                <Text style={styles.widgetValue}>{totalTime}m</Text>
              </View>
            </CardContent>
          </Card>
          <TouchableOpacity onPress={() => navigation?.navigate('Schedule')}>
            <Text style={styles.viewLink}>View Detailed Schedule →</Text>
          </TouchableOpacity>
        </View>

        {/* Weekly Pressure */}
        <View style={styles.quickActionCard}>
          <View style={styles.quickActionHeader}>
            <Text style={styles.quickActionIcon}>🎯</Text>
            <Text style={styles.quickActionTitle}>Weekly pressure</Text>
          </View>
          <Card style={styles.widgetCard}>
            <CardContent style={styles.widgetContent}>
              <View style={styles.pressureWidget}>
                <View style={styles.pressureBadge}>
                  <Text style={styles.pressureBadgeText}>P</Text>
                </View>
                <Text style={styles.pressureText}>This week</Text>
                <Text style={styles.pressureValue}>View</Text>
              </View>
            </CardContent>
          </Card>
          <TouchableOpacity onPress={() => navigation?.navigate('Pressure')}>
            <Text style={styles.viewLink}>View pressure →</Text>
          </TouchableOpacity>
        </View>

        {/* AI Insights */}
        <View style={styles.quickActionCard}>
          <Card>
            <CardHeader>
              <View style={styles.insightsHeader}>
                <View style={styles.insightsIcon}>
                  <Text style={styles.insightsIconText}>💡</Text>
                </View>
                <Text style={styles.cardTitle}>AI Insights</Text>
              </View>
            </CardHeader>
            <CardContent>
              <View style={styles.insightCard}>
                <Text style={styles.insightText}>
                  "Focus is strongest in the morning - we've scheduled your most challenging
                  work first."
                </Text>
              </View>
              <View style={styles.insightCard}>
                <Text style={styles.insightText}>
                  "Consider taking a 15-min break after your current task."
                </Text>
              </View>
              <Button variant="outline" size="sm" style={styles.insightsButton}>
                View Insights
              </Button>
            </CardContent>
          </Card>
        </View>
      </View>

      {/* Today's Tasks List */}
      <View style={styles.tasksSection}>
        <View style={styles.tasksSectionHeader}>
          <Text style={styles.tasksSectionTitle}>Today's Tasks</Text>
          <Button size="sm" onPress={() => navigation?.navigate('Tasks')}>
            + New Task
          </Button>
        </View>

        {todayTasks.length > 0 ? (
          <View style={styles.tasksGrid}>
            {todayTasks.slice(0, 8).map((task) => (
              <View
                key={task.id}
                style={[
                  styles.taskGridItem,
                  isTablet && styles.taskGridItemTablet,
                ]}
              >
                <EnhancedTaskCard
                  task={task}
                  onPress={() => {
                    // Navigate to task detail
                  }}
                />
              </View>
            ))}
          </View>
        ) : (
          <Card style={styles.emptyTasksCard}>
            <CardContent style={styles.emptyTasksContent}>
              <Text style={styles.emptyTasksTitle}>No tasks for today</Text>
              <Text style={styles.emptyTasksDescription}>
                Let's create a plan and get you set up with some tasks!
              </Text>
            </CardContent>
          </Card>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  contentContainer: {
    padding: 16,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#a0a0a0',
    fontSize: 16,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#a0a0a0',
  },
  activeTaskCard: {
    marginBottom: 24,
  },
  activeTaskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityIconText: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#a0a0a0',
  },
  noActiveTaskCard: {
    marginBottom: 24,
  },
  noActiveTaskContent: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  sparkleIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  sparkleIconText: {
    fontSize: 32,
  },
  noActiveTaskTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  noActiveTaskDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  talkButton: {
    width: '100%',
    maxWidth: 300,
  },
  talkButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  quickActions: {
    marginBottom: 24,
    gap: 16,
  },
  quickActionCard: {
    marginBottom: 8,
  },
  quickActionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  quickActionIcon: {
    fontSize: 20,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  widgetCard: {
    backgroundColor: 'rgba(26, 26, 26, 0.5)',
    borderColor: '#2a2a2a',
  },
  widgetContent: {
    padding: 16,
  },
  widgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  widgetLabel: {
    fontSize: 14,
    color: '#a0a0a0',
  },
  widgetValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  pressureWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pressureBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressureBadgeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fbbf24',
  },
  pressureText: {
    flex: 1,
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
    marginLeft: 12,
  },
  pressureValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#06b6d4',
  },
  viewLink: {
    fontSize: 14,
    color: '#06b6d4',
    marginTop: 8,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  insightsIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightsIconText: {
    fontSize: 16,
  },
  insightCard: {
    padding: 12,
    backgroundColor: '#2a2a2a',
    borderLeftWidth: 2,
    borderLeftColor: '#3b82f6',
    borderRadius: 6,
    marginBottom: 12,
  },
  insightText: {
    fontSize: 13,
    color: '#ffffff',
    lineHeight: 18,
  },
  insightsButton: {
    marginTop: 8,
  },
  tasksSection: {
    marginBottom: 24,
  },
  tasksSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tasksSectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  tasksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  taskGridItem: {
    width: '100%',
  },
  taskGridItemTablet: {
    width: 'calc(50% - 6px)',
  },
  emptyTasksCard: {
    paddingVertical: 48,
  },
  emptyTasksContent: {
    alignItems: 'center',
  },
  emptyTasksTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  emptyTasksDescription: {
    fontSize: 14,
    color: '#a0a0a0',
    textAlign: 'center',
  },
});
