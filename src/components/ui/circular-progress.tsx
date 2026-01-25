"use client";

import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  gradient?: 'blue-purple' | 'teal-purple' | 'blue-teal' | 'purple-pink';
  showPercentage?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const gradientDefs = {
  'blue-purple': {
    id: 'gradient-blue-purple',
    stops: [
      { offset: '0%', color: '#3b82f6' },
      { offset: '100%', color: '#8b5cf6' },
    ],
  },
  'teal-purple': {
    id: 'gradient-teal-purple',
    stops: [
      { offset: '0%', color: '#06b6d4' },
      { offset: '50%', color: '#8b5cf6' },
      { offset: '100%', color: '#ec4899' },
    ],
  },
  'blue-teal': {
    id: 'gradient-blue-teal',
    stops: [
      { offset: '0%', color: '#3b82f6' },
      { offset: '100%', color: '#06b6d4' },
    ],
  },
  'purple-pink': {
    id: 'gradient-purple-pink',
    stops: [
      { offset: '0%', color: '#8b5cf6' },
      { offset: '100%', color: '#ec4899' },
    ],
  },
};

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 8,
  gradient = 'blue-purple',
  showPercentage = true,
  children,
  className,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const gradientDef = gradientDefs[gradient];

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id={gradientDef.id} x1="0%" y1="0%" x2="100%" y2="100%">
            {gradientDef.stops.map((stop, index) => (
              <stop key={index} offset={stop.offset} stopColor={stop.color} />
            ))}
          </linearGradient>
        </defs>
        
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-800"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientDef.id})`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showPercentage && (
          <span className="text-2xl font-bold text-white">
            {Math.round(value)}%
          </span>
        ))}
      </div>
    </div>
  );
}
