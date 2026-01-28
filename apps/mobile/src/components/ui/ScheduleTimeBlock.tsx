import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';

interface ScheduleTimeBlockProps {
  startTime: Date;
  endTime: Date;
  title: string;
  duration: number; // in hours
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  focusLevel?: 'shallow' | 'moderate' | 'high' | 'intense' | 'mindful';
  type?: 'work' | 'break' | 'free';
  taskId?: string;
}

const priorityColors = {
  urgent: { bg: 'rgba(239, 68, 68, 0.2)', border: '#ef4444', text: '#f87171' },
  high: { bg: 'rgba(239, 68, 68, 0.2)', border: '#ef4444', text: '#f87171' },
  medium: { bg: 'rgba(249, 115, 22, 0.2)', border: '#f97316', text: '#fb923c' },
  low: { bg: 'rgba(107, 114, 128, 0.2)', border: '#6b7280', text: '#9ca3af' },
};

const focusLabels = {
  intense: 'Intense',
  high: 'High',
  moderate: 'Moderate',
  mindful: 'Mindful',
  shallow: 'Shallow',
};

export function ScheduleTimeBlock({
  startTime,
  endTime,
  title,
  duration,
  priority,
  focusLevel,
  type = 'work',
  taskId,
}: ScheduleTimeBlockProps) {
  const isBreak = type === 'break';
  const isFree = type === 'free';

  const getGradientStyle = () => {
    if (isBreak || isFree) {
      return { backgroundColor: 'rgba(31, 41, 55, 0.5)' };
    }
    if (priority === 'urgent' || priority === 'high') {
      return { backgroundColor: 'rgba(37, 99, 235, 0.2)' };
    }
    if (priority === 'medium') {
      return { backgroundColor: 'rgba(6, 182, 212, 0.2)' };
    }
    return { backgroundColor: 'rgba(147, 51, 234, 0.2)' };
  };

  return (
    <View style={[styles.container, getGradientStyle()]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.time}>{format(startTime, 'h:mm a')}</Text>
          {!isFree && (
            <>
              <Text style={styles.separator}>•</Text>
              <Text style={styles.title}>{title}</Text>
            </>
          )}
          {isFree && (
            <Text style={styles.freeTime}>
              {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')} Free Time
            </Text>
          )}
        </View>

        {!isBreak && !isFree && (
          <View style={styles.metadataRow}>
            {/* Duration */}
            <View style={styles.metadataItem}>
              <Text style={styles.icon}>🕐</Text>
              <Text style={styles.metadataText}>
                {duration} {duration === 1 ? 'hr' : 'hrs'}
              </Text>
            </View>

            {/* Priority Badge */}
            {priority && (
              <View
                style={[
                  styles.priorityBadge,
                  {
                    backgroundColor: priorityColors[priority].bg,
                    borderColor: priorityColors[priority].border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.priorityText,
                    { color: priorityColors[priority].text },
                  ]}
                >
                  {priority === 'urgent'
                    ? 'Urgent'
                    : priority.charAt(0).toUpperCase() + priority.slice(1)}{' '}
                  Priority
                </Text>
              </View>
            )}

            {/* Focus Level */}
            {focusLevel && (
              <View style={styles.metadataItem}>
                <Text style={styles.icon}>🧠</Text>
                <Text style={styles.metadataText}>
                  Focus: {focusLabels[focusLevel]}
                </Text>
              </View>
            )}
          </View>
        )}

        {isBreak && (
          <Text style={styles.breakText}>Time to Recharge</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  time: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  separator: {
    fontSize: 14,
    color: '#6b7280',
    marginHorizontal: 8,
  },
  title: {
    fontSize: 14,
    color: '#9ca3af',
  },
  freeTime: {
    fontSize: 14,
    color: '#9ca3af',
    marginLeft: 8,
  },
  metadataRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center',
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    fontSize: 12,
  },
  metadataText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  breakText: {
    fontSize: 12,
    color: '#6b7280',
  },
});
