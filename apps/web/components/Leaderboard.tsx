"use client";

import React from "react";
import { AgentRanking } from "@callrank/dreamdex-client/types";
import { motion } from "framer-motion";

interface LeaderboardProps {
  rankings: AgentRanking[];
}

export function Leaderboard({ rankings }: LeaderboardProps) {
  return (
    <div className="terminal-panel p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
        <div>
          <h3 className="font-semibold text-sm text-text">Tournament arena leaderboard</h3>
          <p className="text-xs text-text-muted">Fixed-window DreamDEX settlement rankings</p>
        </div>
        <span className="text-xs font-mono text-text-muted bg-surface-raised px-2 py-0.5 rounded-[2px] border border-border">
          Ranked by reputation and P&L
        </span>
      </div>

      {/* Dense Numbered Ranked Table Header */}
      <div className="grid grid-cols-12 gap-3 text-xs font-mono text-text-muted pb-2 px-3 border-b border-border">
        <div className="col-span-1">Rank</div>
        <div className="col-span-4">Agent / Archetype</div>
        <div className="col-span-2 text-right">Reputation</div>
        <div className="col-span-2 text-right">Win rate</div>
        <div className="col-span-3 text-right">Cumulative P&L</div>
      </div>

      {/* Numbered Ranked Rows with Framer Motion Layout Re-ordering */}
      <div className="space-y-1 mt-1.5 flex-1">
        {rankings.map((agent, index) => {
          const isTop = index === 0;
          const isProfitable = agent.cumulativePnl >= 0;

          return (
            <motion.div
              layout
              key={agent.agentId}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className={`grid grid-cols-12 gap-3 items-center px-3 py-2 rounded-[2px] text-xs font-mono border transition-all ${
                isTop
                  ? "bg-surface-raised border-border-active"
                  : "bg-surface/50 border-border hover:border-text-muted"
              }`}
            >
              {/* Earned Rank Number */}
              <div className="col-span-1 font-bold">
                <span
                  className={`w-5 h-5 rounded-[2px] flex items-center justify-center text-xs font-mono ${
                    isTop
                      ? "bg-accent/15 text-accent border border-accent/40"
                      : "text-text-muted bg-surface-raised border border-border"
                  }`}
                >
                  {index + 1}
                </span>
              </div>

              {/* Agent Name & Archetype */}
              <div className="col-span-4">
                <div className="font-semibold text-text truncate">{agent.name}</div>
                <div className="text-[11px] text-text-muted capitalize">{agent.archetype}</div>
              </div>

              {/* Reputation & Badge */}
              <div className="col-span-2 text-right tabular-nums">
                <span className="font-semibold text-text">{agent.reputation}</span>
                <span
                  className={`ml-1.5 text-[10px] px-1 py-0.2 rounded-[2px] border ${
                    agent.badge === "verified"
                      ? "text-accent bg-accent/10 border-accent/30"
                      : "text-text-muted bg-surface border-border"
                  }`}
                >
                  {agent.badge}
                </span>
              </div>

              {/* Win Rate */}
              <div className="col-span-2 text-right tabular-nums">
                <span className="font-semibold text-text">{(agent.winRate * 100).toFixed(1)}%</span>
                <span className="text-[10px] text-text-muted block">
                  {agent.wins}W / {agent.losses}L
                </span>
              </div>

              {/* Cumulative PnL (functional green/red) */}
              <div className="col-span-3 text-right tabular-nums">
                <span
                  className={`font-semibold ${
                    isProfitable ? "text-up" : "text-down"
                  }`}
                >
                  {isProfitable ? "+" : ""}
                  {agent.cumulativePnl.toFixed(1)} USDso
                </span>
                <span className="text-[10px] text-text-muted block">Sharpe: {agent.sharpeRatio.toFixed(2)}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
