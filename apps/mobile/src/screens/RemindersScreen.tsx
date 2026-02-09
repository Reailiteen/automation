import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { InAppReminder } from '@automation/types';
import { inAppReminderRepo } from '@automation/data';

export default function RemindersScreen() {
  const [items, setItems] = useState<InAppReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReminders = useCallback(async () => {
    try {
      setError(null);
      const reminders = await inAppReminderRepo.getAll();
      setItems(Array.isArray(reminders) ? reminders : []);
    } catch (err) {
      console.error('Error loading in-app reminders:', err);
      setError(err instanceof Error ? err.message : 'Failed to load reminders.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadReminders();
  }, [loadReminders]);

  const unreadCount = useMemo(
    () => items.filter((item) => item.status === 'unread').length,
    [items]
  );

  const onRefresh = () => {
    setRefreshing(true);
    void loadReminders();
  };

  const markRead = async (id: string) => {
    try {
      const updated = await inAppReminderRepo.markAsRead(id);
      if (!updated) return;
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (err) {
      console.error('Error marking reminder as read:', err);
      setError(err instanceof Error ? err.message : 'Failed to mark reminder as read.');
    }
  };

  const markAllRead = async () => {
    try {
      const uniqueUserId = items.map((item) => item.userId).find(Boolean);
      if (!uniqueUserId) return;
      await inAppReminderRepo.markAllAsRead(uniqueUserId);
      await loadReminders();
    } catch (err) {
      console.error('Error marking all reminders as read:', err);
      setError(err instanceof Error ? err.message : 'Failed to mark all reminders as read.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerText}>Reminders</Text>
          <Text style={styles.subHeaderText}>Unread: {unreadCount}</Text>
        </View>
        <TouchableOpacity
          style={[styles.actionButton, unreadCount === 0 && styles.actionButtonDisabled]}
          onPress={() => void markAllRead()}
          disabled={unreadCount === 0}
        >
          <Text style={styles.actionButtonText}>Mark all</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ffffff"
          />
        }
      >
        {loading ? (
          <Text style={styles.emptyText}>Loading reminders...</Text>
        ) : items.length === 0 ? (
          <Text style={styles.emptyText}>No reminders yet.</Text>
        ) : (
          items.map((item) => (
            <View
              key={item.id}
              style={[
                styles.itemCard,
                item.status === 'unread' ? styles.itemCardUnread : styles.itemCardRead,
              ]}
            >
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemMessage}>{item.message}</Text>
              <Text style={styles.itemMeta}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
              {item.status === 'unread' ? (
                <TouchableOpacity
                  style={styles.markReadButton}
                  onPress={() => void markRead(item.id)}
                >
                  <Text style={styles.markReadButtonText}>Mark Read</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.readLabel}>Read</Text>
              )}
            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subHeaderText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  actionButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 13,
  },
  errorText: {
    color: '#f87171',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  emptyText: {
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  itemCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  itemCardUnread: {
    backgroundColor: 'rgba(37, 99, 235, 0.18)',
    borderColor: 'rgba(96, 165, 250, 0.5)',
  },
  itemCardRead: {
    backgroundColor: '#111827',
    borderColor: '#1f2937',
  },
  itemTitle: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 6,
  },
  itemMessage: {
    color: '#d1d5db',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  itemMeta: {
    color: '#9ca3af',
    fontSize: 12,
  },
  markReadButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    backgroundColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  markReadButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
  },
  readLabel: {
    marginTop: 10,
    color: '#9ca3af',
    fontSize: 12,
  },
});
