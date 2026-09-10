"use client";

import React, { useEffect, useState } from "react";

interface CountdownRingProps {
  targetTimestamp: number; // Unix timestamp in ms
  totalDurationSeconds: number; // 900 for 15m, 3600 for 1h
  label?: string;
  size?: number;
}

export function CountdownRing({
  targetTimestamp,
  totalDurationSeconds,
  label = "15m window",
  size = 96,
}: CountdownRingProps) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);

  useEffect(() => {
    let animFrameId: number;

    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((targetTimestamp - now) / 1000));
      setSecondsRemaining(diff);
      animFrameId = requestAnimationFrame(update);
    };

    animFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animFrameId);
  }, [targetTimestamp]);

  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Fraction remaining (0.0 to 1.0)
  const fraction = Math.min(1, Math.max(0, secondsRemaining / totalDurationSeconds));
  const strokeDashoffset = circumference - fraction * circumference;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  const isUrgent = secondsRemaining < 120; // under 2 mins
  const ringColor = isUrgent ? "#FF6B6B" : "#2DD4BF";

  return (
    <div className="terminal-panel p-3 flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(124, 132, 150, 0.15)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated active ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            fill="transparent"
            style={{
              transition: "stroke-dashoffset 0.1s linear, stroke 0.3s ease",
            }}
          />
        </svg>

        {/* Center time readout */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="font-mono font-bold text-base text-text tabular-nums leading-none">
            {formattedTime}
          </span>
          <span className="text-[10px] text-text-muted uppercase mt-0.5 font-mono">left</span>
        </div>
      </div>

      <span className="text-xs font-medium text-text mt-2 text-center">{label}</span>
      <span className="text-[10px] text-text-muted font-mono">Settles on chain</span>
    </div>
  );
}
