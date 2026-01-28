import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'priority' | 'status' | 'energy' | 'focus';
  type?: string; // 'urgent', 'high', 'medium', 'low', 'pending', 'in-progress', 'completed', etc.
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Badge({
  children,
  variant = 'default',
  type,
  style,
  textStyle,
}: BadgeProps) {
  const getVariantStyles = () => {
    if (variant === 'priority') {
      switch (type) {
        case 'urgent':
          return { bg: '#ef4444', text: '#ffffff' };
        case 'high':
          return { bg: '#f97316', text: '#ffffff' };
        case 'medium':
          return { bg: '#3b82f6', text: '#ffffff' };
        case 'low':
          return { bg: '#6b7280', text: '#ffffff' };
      }
    }

    if (variant === 'status') {
      switch (type) {
        case 'completed':
          return { bg: '#22c55e', text: '#ffffff' };
        case 'in-progress':
          return { bg: '#3b82f6', text: '#ffffff' };
        case 'pending':
          return { bg: '#6b7280', text: '#ffffff' };
        case 'cancelled':
          return { bg: '#ef4444', text: '#ffffff' };
      }
    }

    if (variant === 'energy') {
      switch (type) {
        case 'high':
          return { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' };
        case 'medium':
          return { bg: 'rgba(249, 115, 22, 0.2)', text: '#f97316' };
        case 'low':
          return { bg: 'rgba(34, 197, 94, 0.2)', text: '#22c55e' };
      }
    }

    if (variant === 'focus') {
      switch (type) {
        case 'deep':
          return { bg: 'rgba(139, 92, 246, 0.2)', text: '#8b5cf6' };
        case 'medium':
          return { bg: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6' };
        case 'shallow':
          return { bg: 'rgba(107, 114, 128, 0.2)', text: '#9ca3af' };
      }
    }

    return { bg: '#2a2a2a', text: '#a0a0a0' };
  };

  const colors = getVariantStyles();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.bg },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: colors.text },
          textStyle,
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
