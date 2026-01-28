import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Task } from '@automation/types';
import { taskRepo } from '@automation/data';
import { EnhancedTaskCard } from '../components/tasks/EnhancedTaskCard';
import { TaskCreationForm } from '../components/tasks/TaskCreationForm';
import TaskDetailScreen from './TaskDetailScreen';
import { Button } from '../components/ui/Button';

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

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

  const handleTaskPress = (task: Task) => {
    setSelectedTaskId(task.id);
  };

  const handleStartTask = async (task: Task) => {
    try {
      await taskRepo.update(task.id, { status: 'in-progress' });
      await loadTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (selectedTaskId) {
    return (
      <TaskDetailScreen
        taskId={selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
        onTaskUpdated={loadTasks}
      />
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerText}>Tasks</Text>
          <Text style={styles.subHeaderText}>{tasks.length} active</Text>
        </View>
        <Button onPress={() => setShowCreateForm(true)} size="sm">
          + New
        </Button>
      </View>

      <ScrollView
        style={styles.taskList}
        contentContainerStyle={styles.taskListContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ffffff"
          />
        }
      >
        {tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No active tasks</Text>
            <Text style={styles.emptySubText}>
              Use voice or chat to create tasks
            </Text>
            <Button
              onPress={() => setShowCreateForm(true)}
              style={styles.createButton}
            >
              Create Your First Task
            </Button>
          </View>
        ) : (
          tasks.map((task) => (
            <EnhancedTaskCard
              key={task.id}
              task={task}
              onPress={() => handleTaskPress(task)}
              onStartTask={() => handleStartTask(task)}
            />
          ))
        )}
      </ScrollView>

      <TaskCreationForm
        visible={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onTaskCreated={loadTasks}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  taskListContent: {
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
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#a0a0a0',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  createButton: {
    width: '100%',
    maxWidth: 300,
  },
});
