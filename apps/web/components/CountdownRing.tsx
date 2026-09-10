"use client";

import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface CountdownRingProps {
  targetTimestamp: number; // Unix timestamp in ms
  totalDurationSeconds: number; // 900 for 15m, 3600 for 1h
  label?: string;
  size?: number;
}

export function CountdownRing({
  targetTimestamp,
  totalDurationSeconds,
  label = "15m Window",
  size = 110,
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

  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Fraction remaining (0.0 to 1.0)
  const fraction = Math.min(1, Math.max(0, secondsRemaining / totalDurationSeconds));
  const strokeDashoffset = circumference - fraction * circumference;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  // Color transitions as expiry approaches
  const isUrgent = secondsRemaining < 120; // under 2 mins
  const ringColor = isUrgent ? "#f43f5e" : "#6366f1";
  const glowColor = isUrgent ? "rgba(244, 63, 94, 0.4)" : "rgba(99, 102, 241, 0.35)";

  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-xl glass-panel border border-border">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(30, 44, 77, 0.7)"
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
              filter: `drop-shadow(0 0 6px ${glowColor})`,
            }}
          />
        </svg>

        {/* Center time readout */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <Clock className={`w-3.5 h-3.5 mb-0.5 ${isUrgent ? "text-rose-400 animate-pulse" : "text-primary"}`} />
          <span className="font-mono font-bold text-base text-white tracking-tight leading-none">
            {formattedTime}
          </span>
          <span className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">TTL</span>
        </div>
      </div>

      <span className="text-xs font-semibold text-slate-300 mt-2 text-center tracking-wide">{label}</span>
      <span className="text-[10px] text-slate-500 font-mono">Settles On-Chain</span>
    </div>
  );
}
