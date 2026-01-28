import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Task } from '@automation/types';
import { taskRepo } from '@automation/data';

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const allTasks = await taskRepo.getAll();
      // Filter only active tasks (not completed or cancelled)
      const activeTasks = allTasks.filter(
        (t) => t.status !== 'completed' && t.status !== 'cancelled'
      );
      setTasks(activeTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadTasks();
  };

  const handleTaskPress = async (task: Task) => {
    // Toggle task status
    const newStatus = task.status === 'pending' ? 'in-progress' : 'pending';
    try {
      await taskRepo.update(task.id, { status: newStatus });
      await loadTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '#ef4444';
      case 'high':
        return '#f97316';
      case 'medium':
        return '#3b82f6';
      case 'low':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Tasks</Text>
        <Text style={styles.subHeaderText}>{tasks.length} active</Text>
      </View>

      <ScrollView
        style={styles.taskList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No active tasks</Text>
            <Text style={styles.emptySubText}>
              Use voice or chat to create tasks
            </Text>
          </View>
        ) : (
          tasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              style={styles.taskCard}
              onPress={() => handleTaskPress(task)}
            >
              <View style={styles.taskHeader}>
                <View
                  style={[
                    styles.priorityIndicator,
                    { backgroundColor: getPriorityColor(task.priority) },
                  ]}
                />
                <View style={styles.taskContent}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  {task.description && (
                    <Text style={styles.taskDescription} numberOfLines={2}>
                      {task.description}
                    </Text>
                  )}
                  <View style={styles.taskMeta}>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{task.kind}</Text>
                    </View>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{task.status}</Text>
                    </View>
                    {task.estimatedTime && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                          {task.estimatedTime}min
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
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
  taskList: {
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
  taskCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  taskHeader: {
    flexDirection: 'row',
  },
  priorityIndicator: {
    width: 4,
  },
  taskContent: {
    flex: 1,
    padding: 16,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 14,
    color: '#a0a0a0',
    marginBottom: 12,
    lineHeight: 20,
  },
  taskMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    color: '#a0a0a0',
    textTransform: 'capitalize',
  },
});
