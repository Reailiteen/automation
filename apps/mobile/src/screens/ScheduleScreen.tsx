import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { differenceInMinutes } from 'date-fns';
import { EnergyGauge } from '../components/ui/EnergyGauge';
import { ScheduleTimeBlock } from '../components/ui/ScheduleTimeBlock';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Schedule, ScheduledTask, Task, ValidationIssue } from '@automation/types';

type BlockDetail = {
  block: ScheduledTask;
  task?: Task;
};

export default function ScheduleScreen() {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [blocks, setBlocks] = useState<BlockDetail[]>([]);
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [energyLevel, setEnergyLevel] = useState<'low' | 'medium' | 'high'>('high');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const todayKey = useMemo(() => new Date().toISOString().split('T')[0], []);

  const buildBlocks = (scheduleData: Schedule, tasks: Task[]) => {
    const taskMap = tasks.reduce<Record<string, Task>>((acc, task) => {
      acc[task.id] = task;
      return acc;
    }, {});

    return (scheduleData.tasks ?? []).map((block) => ({
      block,
      task: taskMap[block.taskId],
    }));
  };

  const loadSchedule = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [scheduleRes, tasksRes] = await Promise.all([
        fetch(`/api/schedules?date=${todayKey}`),
        fetch('/api/tasks'),
      ]);

      if (!scheduleRes.ok) {
        const message =
          scheduleRes.status === 401
            ? 'Sign in to load your schedule.'
            : 'Unable to load schedule right now.';
        throw new Error(message);
      }

      const [scheduleData, tasksData] = await Promise.all([
        scheduleRes.json(),
        tasksRes.ok ? tasksRes.json() : [],
      ]);

      setSchedule(scheduleData);
      setValidationIssues(scheduleData.validation?.issues ?? []);
      setBlocks(buildBlocks(scheduleData, tasksData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load schedule');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [todayKey]);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  useEffect(() => {
    if (!validationIssues.length) {
      setEnergyLevel('high');
      return;
    }
    if (validationIssues.some((issue) => issue.severity === 'error')) {
      setEnergyLevel('low');
    } else if (validationIssues.some((issue) => issue.severity === 'warn')) {
      setEnergyLevel('medium');
    } else {
      setEnergyLevel('high');
    }
  }, [validationIssues]);

  const onRefresh = () => {
    setRefreshing(true);
    loadSchedule();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIconContainer}>
          <Text style={styles.headerIcon}>📅</Text>
        </View>
        <View>
          <Text style={styles.headerText}>Today's Schedule</Text>
          <Text style={styles.subHeaderText}>
            {loading
              ? 'Loading…'
              : `${blocks.length} time block${blocks.length === 1 ? '' : 's'}`}
          </Text>
        </View>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {validationIssues.length > 0 && (
        <View style={styles.validationBanner}>
          {validationIssues.map((issue) => (
            <View
              key={issue.code}
              style={[
                styles.validationRow,
                issue.severity === 'error'
                  ? styles.validationError
                  : styles.validationWarn,
              ]}
            >
              <Text style={styles.validationLabel}>{issue.severity.toUpperCase()}</Text>
              <Text style={styles.validationMessage}>{issue.message}</Text>
            </View>
          ))}
        </View>
      )}

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ffffff"
          />
        }
      >
        {/* Energy Gauge Card */}
        <Card style={styles.energyCard}>
          <CardHeader>
            <Text style={styles.cardTitle}>Energy Level</Text>
          </CardHeader>
          <CardContent style={styles.energyContent}>
            <EnergyGauge level={energyLevel} size={200} />
            <View style={styles.energyButtons}>
              <View style={styles.buttonRow}>
                {(['low', 'medium', 'high'] as const).map((level) => (
                  <View
                    key={level}
                    style={[
                      styles.energyButton,
                      energyLevel === level && styles.energyButtonActive,
                    ]}
                    onTouchEnd={() => setEnergyLevel(level)}
                  >
                    <Text
                      style={[
                        styles.energyButtonText,
                        energyLevel === level && styles.energyButtonTextActive,
                      ]}
                    >
                      {level.toUpperCase()}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </CardContent>
        </Card>

        <View style={styles.scheduleSection}>
          <Text style={styles.sectionTitle}>Time Blocks</Text>
          {loading && (
            <ActivityIndicator size="small" color="#9fa3af" style={styles.loader} />
          )}
          {!loading && blocks.length === 0 && (
            <Text style={styles.emptyText}>No scheduled blocks for today yet.</Text>
          )}
          {blocks.map((detail, index) => {
            const { block, task } = detail;
            const startTime = new Date(block.scheduledStart);
            const endTime = new Date(block.scheduledEnd);
            const durationMinutes = differenceInMinutes(endTime, startTime);
            const durationHours = Math.max(
              Math.round((durationMinutes / 60) * 10) / 10,
              0.25
            );
            const priority = (task?.priority ?? 'medium') as
              | 'low'
              | 'medium'
              | 'high'
              | 'urgent';
            const focusLevel = (task?.focusLevel ?? 'moderate') as
              | 'moderate'
              | 'intense'
              | 'mindful'
              | 'high'
              | 'shallow';
            const type =
              block.context?.toLowerCase().includes('break') ||
              block.context?.toLowerCase().includes('pause')
                ? 'break'
                : block.context?.toLowerCase().includes('free')
                ? 'free'
                : 'work';

            return (
              <View key={`${block.taskId}-${startTime.toISOString()}`} style={styles.scheduleBlock}>
                <ScheduleTimeBlock
                  startTime={startTime}
                  endTime={endTime}
                  title={task?.title ?? 'Scheduled Task'}
                  duration={durationHours}
                  priority={priority}
                  focusLevel={focusLevel}
                  type={type}
                />
              </View>
            );
          })}
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
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#1a1a1a',
    gap: 12,
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: 24,
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 32,
  },
  energyCard: {
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  energyContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  energyButtons: {
    marginTop: 24,
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  energyButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
  },
  energyButtonActive: {
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  energyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  energyButtonTextActive: {
    color: '#3b82f6',
  },
  scheduleSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  scheduleBlock: {
    marginBottom: 12,
  },
  errorBanner: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#4b0f0f',
  },
  errorText: {
    color: '#f87171',
    fontSize: 13,
  },
  validationBanner: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  validationRow: {
    borderLeftWidth: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginBottom: 8,
  },
  validationError: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: '#ef4444',
  },
  validationWarn: {
    backgroundColor: 'rgba(250, 204, 21, 0.1)',
    borderColor: '#facc15',
  },
  validationLabel: {
    color: '#e5e7eb',
    fontSize: 12,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  validationMessage: {
    color: '#cbd5f5',
    fontSize: 13,
  },
  loader: {
    marginBottom: 12,
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 13,
    marginBottom: 8,
  },
});
