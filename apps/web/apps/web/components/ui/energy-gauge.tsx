"use client";

import { cn } from "@/lib/utils";

interface EnergyGaugeProps {
  level: 'low' | 'medium' | 'high';
  size?: number;
  className?: string;
}

export function EnergyGauge({ level, size = 200, className }: EnergyGaugeProps) {
  const levelValues = {
    low: { angle: 30, color: '#ef4444' },
    medium: { angle: 150, color: '#f97316' },
    high: { angle: 270, color: '#22c55e' },
  };

  const currentLevel = levelValues[level];
  const needleRotation = currentLevel.angle;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 200 200" className="transform -rotate-90">
        <defs>
          <linearGradient id="energy-spectrum" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
        
        {/* Background arc */}
        <path
          d="M 20,100 A 80,80 0 1,1 180,100"
          fill="none"
          stroke="url(#energy-spectrum)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        
        {/* Level markers */}
        <g transform="rotate(30 100 100)">
          <line x1="100" y1="20" x2="100" y2="30" stroke="currentColor" strokeWidth="2" className="text-gray-600" />
          <text x="100" y="15" textAnchor="middle" className="text-xs fill-gray-400" transform="rotate(90 100 15)">
            LOW
          </text>
        </g>
        <g transform="rotate(150 100 100)">
          <line x1="100" y1="20" x2="100" y2="30" stroke="currentColor" strokeWidth="2" className="text-gray-600" />
          <text x="100" y="15" textAnchor="middle" className="text-xs fill-gray-400" transform="rotate(90 100 15)">
            MEDIUM
          </text>
        </g>
        <g transform="rotate(270 100 100)">
          <line x1="100" y1="20" x2="100" y2="30" stroke="currentColor" strokeWidth="2" className="text-gray-600" />
          <text x="100" y="15" textAnchor="middle" className="text-xs fill-gray-400" transform="rotate(90 100 15)">
            HIGH
          </text>
        </g>
        
        {/* Needle */}
        <g transform={`rotate(${needleRotation} 100 100)`}>
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="30"
            stroke={currentLevel.color}
            strokeWidth="3"
            strokeLinecap="round"
            className="transition-transform duration-500"
          />
          <circle cx="100" cy="100" r="6" fill={currentLevel.color} />
        </g>
      </svg>
      
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm text-gray-400 mb-1">Energy Level</span>
        <span className="text-xl font-semibold" style={{ color: currentLevel.color }}>
          {level.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
