import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Plan } from '@automation/types';
import { Card, CardContent } from '../ui/Card';
import { CircularProgress } from '../ui/CircularProgress';
import { Badge } from '../ui/Badge';

interface PlanCardProps {
  plan: Plan;
  progress: number; // 0-100
  taskCount?: number;
  energyLevel?: 'low' | 'medium' | 'high';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  onPress?: () => void;
  isActive?: boolean;
}

export function PlanCard({
  plan,
  progress,
  taskCount,
  energyLevel,
  priority,
  onPress,
  isActive = false,
}: PlanCardProps) {
  const getGradient = () => {
    if (progress < 33) return 'blue-purple';
    if (progress < 66) return 'teal-purple';
    return 'purple-pink';
  };

  const getStatusColor = () => {
    switch (plan.status) {
      case 'active':
        return '#22c55e';
      case 'completed':
        return '#3b82f6';
      case 'draft':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={[styles.card, isActive && styles.activeCard]}>
        <CardContent style={styles.content}>
          {/* Header with circular progress */}
          <View style={styles.header}>
            <CircularProgress
              value={progress}
              size={80}
              strokeWidth={6}
              gradient={getGradient()}
              showPercentage={true}
            />

            <View style={styles.headerInfo}>
              <Text style={styles.title} numberOfLines={2}>
                {plan.title}
              </Text>

              {/* Status Badge */}
              <View style={styles.statusBadge}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: getStatusColor() },
                  ]}
                />
                <Text
                  style={[styles.statusText, { color: getStatusColor() }]}
                >
                  {plan.status}
                </Text>
              </View>
            </View>
          </View>

          {/* Description */}
          {plan.description && (
            <Text style={styles.description} numberOfLines={2}>
              {plan.description}
            </Text>
          )}

          {/* Badges Row */}
          <View style={styles.badgesRow}>
            {energyLevel && (
              <Badge variant="energy" type={energyLevel}>
                {energyLevel} energy
              </Badge>
            )}
            {priority && (
              <Badge variant="priority" type={priority}>
                {priority}
              </Badge>
            )}
          </View>

          {/* Metadata */}
          <View style={styles.metadata}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Tasks</Text>
              <Text style={styles.metaValue}>
                {taskCount !== undefined ? taskCount : plan.tasks?.length || 0}
              </Text>
            </View>

            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Progress</Text>
              <Text style={styles.metaValue}>{Math.round(progress)}%</Text>
            </View>

            {plan.createdAt && (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Created</Text>
                <Text style={styles.metaValue}>
                  {new Date(plan.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            )}
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  activeCard: {
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 16,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 14,
    color: '#a0a0a0',
    lineHeight: 20,
    marginBottom: 12,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
