import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Line,
  Circle,
  G,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

interface EnergyGaugeProps {
  level: 'low' | 'medium' | 'high';
  size?: number;
}

export function EnergyGauge({ level, size = 200 }: EnergyGaugeProps) {
  const levelValues = {
    low: { angle: 30, color: '#ef4444' },
    medium: { angle: 150, color: '#f97316' },
    high: { angle: 270, color: '#22c55e' },
  };

  const currentLevel = levelValues[level];
  const needleRotation = currentLevel.angle;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        style={{ transform: [{ rotate: '-90deg' }] }}
      >
        <Defs>
          <LinearGradient id="energy-spectrum" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#ef4444" />
            <Stop offset="50%" stopColor="#f97316" />
            <Stop offset="100%" stopColor="#22c55e" />
          </LinearGradient>
        </Defs>

        {/* Background arc */}
        <Path
          d="M 20,100 A 80,80 0 1,1 180,100"
          fill="none"
          stroke="url(#energy-spectrum)"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Level markers - LOW */}
        <G rotation={30} origin="100, 100">
          <Line
            x1="100"
            y1="20"
            x2="100"
            y2="30"
            stroke="#6b7280"
            strokeWidth="2"
          />
          <SvgText
            x="100"
            y="15"
            fontSize="10"
            fill="#9ca3af"
            textAnchor="middle"
            rotation={90}
            origin="100, 15"
          >
            LOW
          </SvgText>
        </G>

        {/* Level markers - MEDIUM */}
        <G rotation={150} origin="100, 100">
          <Line
            x1="100"
            y1="20"
            x2="100"
            y2="30"
            stroke="#6b7280"
            strokeWidth="2"
          />
          <SvgText
            x="100"
            y="15"
            fontSize="10"
            fill="#9ca3af"
            textAnchor="middle"
            rotation={90}
            origin="100, 15"
          >
            MED
          </SvgText>
        </G>

        {/* Level markers - HIGH */}
        <G rotation={270} origin="100, 100">
          <Line
            x1="100"
            y1="20"
            x2="100"
            y2="30"
            stroke="#6b7280"
            strokeWidth="2"
          />
          <SvgText
            x="100"
            y="15"
            fontSize="10"
            fill="#9ca3af"
            textAnchor="middle"
            rotation={90}
            origin="100, 15"
          >
            HIGH
          </SvgText>
        </G>

        {/* Needle */}
        <G rotation={needleRotation} origin="100, 100">
          <Line
            x1="100"
            y1="100"
            x2="100"
            y2="30"
            stroke={currentLevel.color}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <Circle cx="100" cy="100" r="6" fill={currentLevel.color} />
        </G>
      </Svg>

      {/* Center label */}
      <View style={styles.centerLabel}>
        <Text style={styles.labelText}>Energy Level</Text>
        <Text style={[styles.levelText, { color: currentLevel.color }]}>
          {level.toUpperCase()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 4,
  },
  levelText: {
    fontSize: 20,
    fontWeight: '600',
  },
});
