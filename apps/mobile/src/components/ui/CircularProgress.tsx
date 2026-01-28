import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

interface CircularProgressProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  gradient?: 'blue-purple' | 'teal-purple' | 'blue-teal' | 'purple-pink';
  showPercentage?: boolean;
  children?: React.ReactNode;
}

const gradientDefs = {
  'blue-purple': {
    id: 'gradient-blue-purple',
    colors: ['#3b82f6', '#8b5cf6'],
  },
  'teal-purple': {
    id: 'gradient-teal-purple',
    colors: ['#06b6d4', '#8b5cf6', '#ec4899'],
  },
  'blue-teal': {
    id: 'gradient-blue-teal',
    colors: ['#3b82f6', '#06b6d4'],
  },
  'purple-pink': {
    id: 'gradient-purple-pink',
    colors: ['#8b5cf6', '#ec4899'],
  },
};

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 8,
  gradient = 'blue-purple',
  showPercentage = true,
  children,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const gradientDef = gradientDefs[gradient];
  const center = size / 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Defs>
          <LinearGradient id={gradientDef.id} x1="0%" y1="0%" x2="100%" y2="100%">
            {gradientDef.colors.map((color, index) => (
              <Stop
                key={index}
                offset={`${(index / (gradientDef.colors.length - 1)) * 100}%`}
                stopColor={color}
              />
            ))}
          </LinearGradient>
        </Defs>

        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#1a1a1a"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={`url(#${gradientDef.id})`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>

      {/* Center content */}
      <View style={styles.centerContent}>
        {children || (showPercentage && (
          <Text style={styles.percentage}>{Math.round(value)}%</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    transform: [{ rotate: '-90deg' }],
  },
  centerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
