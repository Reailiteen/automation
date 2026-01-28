import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { EnergyGauge } from '../components/ui/EnergyGauge';
import { ScheduleTimeBlock } from '../components/ui/ScheduleTimeBlock';
import { Card, CardHeader, CardContent } from '../components/ui/Card';

export default function ScheduleScreen() {
  const [energyLevel, setEnergyLevel] = useState<'low' | 'medium' | 'high'>('high');
  const [refreshing, setRefreshing] = useState(false);

  // Mock schedule data
  const schedule = [
    {
      startTime: new Date(2024, 0, 1, 9, 0),
      endTime: new Date(2024, 0, 1, 11, 0),
      title: 'Deep Work Session',
      duration: 2,
      priority: 'high' as const,
      focusLevel: 'intense' as const,
      type: 'work' as const,
    },
    {
      startTime: new Date(2024, 0, 1, 11, 0),
      endTime: new Date(2024, 0, 1, 12, 0),
      title: 'Email & Messages',
      duration: 1,
      priority: 'medium' as const,
      focusLevel: 'moderate' as const,
      type: 'work' as const,
    },
    {
      startTime: new Date(2024, 0, 1, 12, 0),
      endTime: new Date(2024, 0, 1, 13, 0),
      title: 'Lunch Break',
      duration: 1,
      type: 'break' as const,
    },
    {
      startTime: new Date(2024, 0, 1, 13, 0),
      endTime: new Date(2024, 0, 1, 15, 0),
      title: 'Execution Task',
      duration: 2,
      priority: 'urgent' as const,
      focusLevel: 'high' as const,
      type: 'work' as const,
    },
    {
      startTime: new Date(2024, 0, 1, 15, 0),
      endTime: new Date(2024, 0, 1, 16, 0),
      title: 'Reflection',
      duration: 1,
      priority: 'low' as const,
      focusLevel: 'mindful' as const,
      type: 'work' as const,
    },
    {
      startTime: new Date(2024, 0, 1, 17, 0),
      endTime: new Date(2024, 0, 1, 18, 0),
      title: 'Free Time',
      duration: 1,
      type: 'free' as const,
    },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
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
          <Text style={styles.subHeaderText}>{schedule.length} time blocks</Text>
        </View>
      </View>

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

        {/* Schedule Blocks */}
        <View style={styles.scheduleSection}>
          <Text style={styles.sectionTitle}>Time Blocks</Text>
          {schedule.map((block, index) => (
            <View key={index} style={styles.scheduleBlock}>
              <ScheduleTimeBlock
                startTime={block.startTime}
                endTime={block.endTime}
                title={block.title}
                duration={block.duration}
                priority={block.priority}
                focusLevel={block.focusLevel}
                type={block.type}
              />
            </View>
          ))}
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
});
