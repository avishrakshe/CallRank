"use client";

import React from "react";
import { AgentRanking } from "@callrank/dreamdex-client/types";
import { Trophy, TrendingUp, ShieldCheck, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface LeaderboardProps {
  rankings: AgentRanking[];
}

export function Leaderboard({ rankings }: LeaderboardProps) {
  return (
    <div className="glass-panel rounded-xl p-4 border border-border flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-border/70 mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">Tournament Arena Leaderboard</h3>
            <p className="text-[11px] text-slate-400">Fixed-Window DreamDEX Settlement Rankings</p>
          </div>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/30">
          Ranked by Rep & PnL
        </span>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-2 text-[11px] font-mono font-semibold text-slate-400 pb-2 px-3 border-b border-border/40">
        <div className="col-span-1">#</div>
        <div className="col-span-4">AGENT / ARCHETYPE</div>
        <div className="col-span-2 text-right">REP / BADGE</div>
        <div className="col-span-2 text-right">WIN RATE</div>
        <div className="col-span-3 text-right">CUMULATIVE P&L</div>
      </div>

      {/* Re-ranking rows with framer-motion layout animation */}
      <div className="space-y-2 mt-2 flex-1">
        {rankings.map((agent, index) => {
          const isTop = index === 0;
          const isProfitable = agent.cumulativePnl >= 0;

          return (
            <motion.div
              layout
              key={agent.agentId}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className={`grid grid-cols-12 gap-2 items-center px-3 py-2.5 rounded-lg text-xs font-mono border transition-all ${
                isTop
                  ? "bg-primary/10 border-primary/40 shadow-sm"
                  : "bg-surface-raised/50 border-border/70 hover:border-border"
              }`}
            >
              {/* Rank Index */}
              <div className="col-span-1 flex items-center font-bold">
                {index === 0 ? (
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] border border-amber-500/40">
                    1
                  </span>
                ) : index === 1 ? (
                  <span className="w-5 h-5 rounded-full bg-slate-400/20 text-slate-300 flex items-center justify-center text-[10px] border border-slate-400/40">
                    2
                  </span>
                ) : (
                  <span className="w-5 h-5 rounded-full bg-amber-700/20 text-amber-600 flex items-center justify-center text-[10px] border border-amber-700/40">
                    3
                  </span>
                )}
              </div>

              {/* Agent Name & Archetype */}
              <div className="col-span-4">
                <div className="font-bold text-white tracking-wide truncate">{agent.name}</div>
                <div className="text-[10px] text-slate-400 capitalize">{agent.archetype}</div>
              </div>

              {/* Reputation & Badge */}
              <div className="col-span-2 text-right flex flex-col items-end justify-center">
                <span className="font-bold text-white">{agent.reputation}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                    agent.badge === "verified"
                      ? "text-emerald-400 bg-emerald-500/10"
                      : "text-rose-400 bg-rose-500/10"
                  }`}
                >
                  {agent.badge}
                </span>
              </div>

              {/* Win Rate */}
              <div className="col-span-2 text-right">
                <div className="font-bold text-white">{(agent.winRate * 100).toFixed(1)}%</div>
                <div className="text-[10px] text-slate-400">
                  {agent.wins}W / {agent.losses}L
                </div>
              </div>

              {/* Cumulative PnL */}
              <div className="col-span-3 text-right">
                <div className={`font-extrabold ${isProfitable ? "text-emerald-400" : "text-rose-400"}`}>
                  {isProfitable ? "+" : ""}
                  {agent.cumulativePnl.toFixed(1)} USDso
                </div>
                <div className="text-[10px] text-slate-400">Sharpe: {agent.sharpeRatio.toFixed(2)}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
