import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Task } from '@automation/types';
import { taskRepo } from '@automation/data';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CircularProgress } from '../components/ui/CircularProgress';

interface TaskDetailScreenProps {
  taskId: string;
  onClose: () => void;
  onTaskUpdated?: () => void;
}

export default function TaskDetailScreen({
  taskId,
  onClose,
  onTaskUpdated,
}: TaskDetailScreenProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTask();
  }, [taskId]);

  const loadTask = async () => {
    try {
      const taskData = await taskRepo.getById(taskId);
      setTask(taskData || null);
    } catch (error) {
      console.error('Error loading task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: Task['status']) => {
    if (!task) return;

    try {
      await taskRepo.update(task.id, { status: newStatus });
      await loadTask();
      onTaskUpdated?.();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async () => {
    if (!task) return;

    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await taskRepo.delete(task.id);
              onTaskUpdated?.();
              onClose();
            } catch (error) {
              console.error('Error deleting task:', error);
            }
          },
        },
      ]
    );
  };

  const calculateProgress = () => {
    if (!task?.subtasks || task.subtasks.length === 0) return 0;
    // Simplified: assume all subtasks are just strings for now
    // In real implementation, you'd check their completion status
    return 0;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading task...</Text>
        </View>
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Task not found</Text>
          <Button onPress={onClose}>Go Back</Button>
        </View>
      </View>
    );
  }

  const progress = calculateProgress();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Card */}
        <Card style={styles.mainCard}>
          <CardContent style={styles.mainContent}>
            {/* Progress Circle (if has subtasks) */}
            {task.subtasks && task.subtasks.length > 0 && (
              <View style={styles.progressSection}>
                <CircularProgress
                  value={progress}
                  size={100}
                  strokeWidth={8}
                  gradient="blue-purple"
                />
              </View>
            )}

            {/* Title */}
            <Text style={styles.title}>{task.title}</Text>

            {/* Badges Row */}
            <View style={styles.badgesRow}>
              <Badge variant="priority" type={task.priority}>
                {task.priority}
              </Badge>
              <Badge variant="status" type={task.status}>
                {task.status}
              </Badge>
              {task.focusLevel && (
                <Badge variant="focus" type={task.focusLevel}>
                  {task.focusLevel}
                </Badge>
              )}
              {task.energyRequirement && (
                <Badge variant="energy" type={task.energyRequirement}>
                  {task.energyRequirement}
                </Badge>
              )}
            </View>

            {/* Description */}
            {task.description && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{task.description}</Text>
              </View>
            )}

            {/* Metadata Grid */}
            <View style={styles.metadataGrid}>
              {task.estimatedTime && (
                <View style={styles.metadataItem}>
                  <Text style={styles.metadataLabel}>Estimated Time</Text>
                  <Text style={styles.metadataValue}>{task.estimatedTime}m</Text>
                </View>
              )}
              {task.kind && (
                <View style={styles.metadataItem}>
                  <Text style={styles.metadataLabel}>Type</Text>
                  <Text style={styles.metadataValue}>{task.kind}</Text>
                </View>
              )}
              {task.context && (
                <View style={styles.metadataItem}>
                  <Text style={styles.metadataLabel}>Context</Text>
                  <Text style={styles.metadataValue}>{task.context}</Text>
                </View>
              )}
              {task.dueDate && (
                <View style={styles.metadataItem}>
                  <Text style={styles.metadataLabel}>Due Date</Text>
                  <Text style={styles.metadataValue}>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>
          </CardContent>
        </Card>

        {/* Subtasks */}
        {task.subtasks && task.subtasks.length > 0 && (
          <Card style={styles.card}>
            <CardHeader>
              <Text style={styles.cardTitle}>
                Subtasks ({task.subtasks.length})
              </Text>
            </CardHeader>
            <CardContent>
              {task.subtasks.map((subtask, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.checkbox} />
                  <Text style={styles.listItemText}>{subtask}</Text>
                </View>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Dependencies */}
        {task.dependencies && task.dependencies.length > 0 && (
          <Card style={styles.card}>
            <CardHeader>
              <Text style={styles.cardTitle}>
                Dependencies ({task.dependencies.length})
              </Text>
            </CardHeader>
            <CardContent>
              {task.dependencies.map((depId, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.listItemIcon}>🔗</Text>
                  <Text style={styles.listItemText}>Task #{depId.slice(0, 8)}</Text>
                </View>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <Card style={styles.card}>
            <CardHeader>
              <Text style={styles.cardTitle}>Tags</Text>
            </CardHeader>
            <CardContent>
              <View style={styles.tagsContainer}>
                {task.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>
        )}

        {/* AI Insights Card */}
        <Card style={styles.card}>
          <CardHeader>
            <Text style={styles.cardTitle}>AI Insights</Text>
          </CardHeader>
          <CardContent>
            <View style={styles.insightCard}>
              <Text style={styles.insightText}>
                This task requires {task.focusLevel || 'medium'} focus and{' '}
                {task.energyRequirement || 'medium'} energy. Best scheduled during
                your peak hours.
              </Text>
            </View>
            {task.estimatedTime && task.estimatedTime > 60 && (
              <View style={styles.insightCard}>
                <Text style={styles.insightText}>
                  Consider breaking this into smaller subtasks for better
                  manageability.
                </Text>
              </View>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actions}>
          {task.status === 'pending' && (
            <Button
              style={styles.actionButton}
              onPress={() => handleStatusChange('in-progress')}
            >
              Start Task
            </Button>
          )}
          {task.status === 'in-progress' && (
            <>
              <Button
                style={styles.actionButton}
                onPress={() => handleStatusChange('completed')}
              >
                Complete
              </Button>
              <Button
                variant="outline"
                style={styles.actionButton}
                onPress={() => handleStatusChange('pending')}
              >
                Pause
              </Button>
            </>
          )}
          {task.status === 'completed' && (
            <Button
              variant="outline"
              style={styles.actionButton}
              onPress={() => handleStatusChange('pending')}
            >
              Reopen
            </Button>
          )}
          <Button
            variant="outline"
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </Button>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3b82f6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  headerSpacer: {
    width: 60,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#a0a0a0',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    marginBottom: 20,
  },
  mainCard: {
    marginBottom: 16,
  },
  mainContent: {
    padding: 20,
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    lineHeight: 32,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#a0a0a0',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
  },
  metadataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  metadataItem: {
    minWidth: '45%',
  },
  metadataLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  metadataValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    textTransform: 'capitalize',
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#6b7280',
  },
  listItemIcon: {
    fontSize: 16,
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
    color: '#ffffff',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 14,
    color: '#06b6d4',
  },
  insightCard: {
    padding: 12,
    backgroundColor: '#2a2a2a',
    borderLeftWidth: 2,
    borderLeftColor: '#8b5cf6',
    borderRadius: 6,
    marginBottom: 12,
  },
  insightText: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
  },
  actions: {
    marginTop: 8,
    marginBottom: 32,
    gap: 12,
  },
  actionButton: {
    width: '100%',
  },
  deleteButton: {
    borderColor: '#ef4444',
  },
  deleteButtonText: {
    color: '#ef4444',
  },
});
