import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import TasksScreen from '../screens/TasksScreen';
import ChatScreen from '../screens/ChatScreen';
import PlansScreen from '../screens/PlansScreen';

type TabName = 'tasks' | 'chat' | 'plans';

export default function TabNavigator() {
  const [activeTab, setActiveTab] = useState<TabName>('tasks');

  const renderScreen = () => {
    switch (activeTab) {
      case 'tasks':
        return <TasksScreen />;
      case 'chat':
        return <ChatScreen />;
      case 'plans':
        return <PlansScreen />;
      default:
        return <TasksScreen />;
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
        <TabButton name="tasks" label="Tasks" icon="✓" />
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
