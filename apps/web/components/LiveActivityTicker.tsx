"use client";

import React from "react";
import { Radio, Zap } from "lucide-react";

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
    <div className="w-full bg-surface-raised/90 border-y border-border py-2 px-4 flex items-center overflow-hidden shadow-inner">
      {/* Ticker Header Tag */}
      <div className="flex items-center space-x-2 pr-4 border-r border-border shrink-0 z-10 bg-surface-raised/90">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-mono font-bold tracking-wider text-slate-300 flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-primary" /> LIVE STREAM
        </span>
      </div>

      {/* Marquee ticker content */}
      <div className="flex-1 overflow-hidden whitespace-nowrap pl-4 relative">
        <div className="inline-flex space-x-8 animate-marquee">
          {activities.concat(activities).map((act, idx) => (
            <div key={`${act.id}-${idx}`} className="inline-flex items-center space-x-2 text-xs font-mono">
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                  act.category === "settlement"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : act.category === "agent"
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                }`}
              >
                {act.category}
              </span>
              <span className="text-slate-200">{act.message}</span>
              <span className="text-slate-500 text-[11px]">·</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
