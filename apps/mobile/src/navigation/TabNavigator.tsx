import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DashboardScreen from '../screens/DashboardScreen';
import TasksScreen from '../screens/TasksScreen';
import ChatScreen from '../screens/ChatScreen';
import PlansScreen from '../screens/PlansScreen';
import ScheduleScreen from '../screens/ScheduleScreen';

type TabName = 'dashboard' | 'tasks' | 'chat' | 'plans' | 'schedule';

export default function TabNavigator() {
  const [activeTab, setActiveTab] = useState<TabName>('dashboard');

  // Mock navigation object for screens that need it
  const navigation = {
    navigate: (screen: string) => {
      const tabMap: Record<string, TabName> = {
        Dashboard: 'dashboard',
        Tasks: 'tasks',
        Chat: 'chat',
        Plans: 'plans',
        Schedule: 'schedule',
        Pressure: 'dashboard', // No pressure screen yet
      };
      const targetTab = tabMap[screen];
      if (targetTab) {
        setActiveTab(targetTab);
      }
    },
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen navigation={navigation} />;
      case 'tasks':
        return <TasksScreen />;
      case 'chat':
        return <ChatScreen />;
      case 'plans':
        return <PlansScreen />;
      case 'schedule':
        return <ScheduleScreen />;
      default:
        return <DashboardScreen navigation={navigation} />;
    }
  };

  const TabButton = ({
    name,
    label,
    icon,
  }: {
    name: TabName;
    label: string;
    icon: string;
  }) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === name && styles.tabButtonActive]}
      onPress={() => setActiveTab(name)}
    >
      <Text style={styles.tabIcon}>{icon}</Text>
      <Text
        style={[styles.tabLabel, activeTab === name && styles.tabLabelActive]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>{renderScreen()}</View>

      <View style={styles.tabBar}>
        <TabButton name="dashboard" label="Home" icon="🏠" />
        <TabButton name="tasks" label="Tasks" icon="✓" />
        <TabButton name="schedule" label="Schedule" icon="📅" />
        <TabButton name="chat" label="Chat" icon="💬" />
        <TabButton name="plans" label="Plans" icon="📋" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    paddingBottom: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabButtonActive: {
    borderTopWidth: 2,
    borderTopColor: '#3b82f6',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  tabLabelActive: {
    color: '#3b82f6',
    fontWeight: '600',
  },
});
