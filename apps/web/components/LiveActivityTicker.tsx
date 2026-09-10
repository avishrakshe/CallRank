"use client";

import React from "react";

interface ActivityItem {
  id: string;
  message: string;
  timestamp: number;
  category: "market" | "agent" | "settlement";
}

interface LiveActivityTickerProps {
  activities: ActivityItem[];
}

export function LiveActivityTicker({ activities }: LiveActivityTickerProps) {
  return (
    <div className="w-full bg-surface border-y border-border py-1.5 px-4 flex items-center overflow-hidden">
      {/* Ticker Lead Tag */}
      <div className="flex items-center space-x-2 pr-3 border-r border-border shrink-0 z-10 bg-surface">
        <span className="w-2 h-2 rounded-full bg-up animate-pulse" />
        <span className="text-[11px] font-mono text-text-muted">Live feed</span>
      </div>

      {/* Marquee ticker content */}
      <div className="flex-1 overflow-hidden whitespace-nowrap pl-3 relative">
        <div className="inline-flex space-x-6 animate-marquee">
          {activities.concat(activities).map((act, idx) => (
            <div key={`${act.id}-${idx}`} className="inline-flex items-center space-x-2 text-xs font-mono">
              <span
                className={`px-1 py-0.2 rounded-[2px] text-[10px] uppercase font-mono ${
                  act.category === "settlement"
                    ? "bg-surface-raised text-accent border border-border"
                    : act.category === "agent"
                    ? "bg-surface-raised text-up border border-border"
                    : "bg-surface-raised text-text-muted border border-border"
                }`}
              >
                {act.category}
              </span>
              <span className="text-text">{act.message}</span>
              <span className="text-border px-1">/</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
