import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task } from '@automation/types';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface EnhancedTaskCardProps {
  task: Task;
  onPress?: () => void;
  onStartTask?: () => void;
}

export function EnhancedTaskCard({ task, onPress, onStartTask }: EnhancedTaskCardProps) {
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

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        {/* Priority indicator bar */}
        <View
          style={[
            styles.priorityBar,
            { backgroundColor: getPriorityColor(task.priority) },
          ]}
        />

        <CardContent style={styles.content}>
          {/* Title */}
          <Text style={styles.title} numberOfLines={2}>
            {task.title}
          </Text>

          {/* Description */}
          {task.description && (
            <Text style={styles.description} numberOfLines={2}>
              {task.description}
            </Text>
          )}

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
          </View>

          {/* Metadata Row */}
          <View style={styles.metaRow}>
            {task.estimatedTime && (
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>⏱️</Text>
                <Text style={styles.metaText}>{task.estimatedTime}m</Text>
              </View>
            )}
            {task.energyRequirement && (
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>⚡</Text>
                <Text style={styles.metaText}>{task.energyRequirement}</Text>
              </View>
            )}
            {task.kind && (
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>📋</Text>
                <Text style={styles.metaText}>{task.kind}</Text>
              </View>
            )}
          </View>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <View style={styles.tagsRow}>
              {task.tags.slice(0, 3).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
              {task.tags.length > 3 && (
                <Text style={styles.moreTagsText}>+{task.tags.length - 3}</Text>
              )}
            </View>
          )}

          {/* Start Task Button */}
          {onStartTask && task.status === 'pending' && (
            <TouchableOpacity
              style={styles.startButton}
              onPress={onStartTask}
              activeOpacity={0.8}
            >
              <Text style={styles.startButtonText}>Start Task</Text>
            </TouchableOpacity>
          )}
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    overflow: 'hidden',
  },
  priorityBar: {
    height: 4,
    width: '100%',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#a0a0a0',
    marginBottom: 12,
    lineHeight: 20,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaIcon: {
    fontSize: 14,
  },
  metaText: {
    fontSize: 12,
    color: '#9ca3af',
    textTransform: 'capitalize',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 11,
    color: '#06b6d4',
  },
  moreTagsText: {
    fontSize: 11,
    color: '#6b7280',
    alignSelf: 'center',
  },
  startButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
