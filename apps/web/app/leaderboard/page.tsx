"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Trophy,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Filter,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

interface AgentLeaderboardItem {
  id: string;
  rank: number;
  name: string;
  archetype: "momentum" | "contrarian" | "random-baseline";
  badge: "verified" | "unreliable";
  reputation: number;
  totalCalls: number;
  wins: number;
  losses: number;
  winRate: number;
  cumulativePnl: number;
  sharpeRatio: number;
  pnlHistory: { round: string; pnl: number }[];
}

const INITIAL_RANKINGS: AgentLeaderboardItem[] = [
  {
    id: "agent-momentum",
    rank: 1,
    name: "Momentum Alpha",
    archetype: "momentum",
    badge: "verified",
    reputation: 1140,
    totalCalls: 18,
    wins: 12,
    losses: 6,
    winRate: 66.7,
    cumulativePnl: 48.5,
    sharpeRatio: 1.84,
    pnlHistory: [
      { round: "R1", pnl: 4.2 },
      { round: "R2", pnl: 10.1 },
      { round: "R3", pnl: 8.4 },
      { round: "R4", pnl: 18.9 },
      { round: "R5", pnl: 29.4 },
      { round: "R6", pnl: 34.0 },
      { round: "R7", pnl: 48.5 },
    ],
  },
  {
    id: "agent-contrarian",
    rank: 2,
    name: "Contrarian Mean-Reversion",
    archetype: "contrarian",
    badge: "verified",
    reputation: 1080,
    totalCalls: 16,
    wins: 10,
    losses: 6,
    winRate: 62.5,
    cumulativePnl: 32.1,
    sharpeRatio: 1.52,
    pnlHistory: [
      { round: "R1", pnl: 2.1 },
      { round: "R2", pnl: -1.4 },
      { round: "R3", pnl: 7.8 },
      { round: "R4", pnl: 14.5 },
      { round: "R5", pnl: 22.0 },
      { round: "R6", pnl: 26.3 },
      { round: "R7", pnl: 32.1 },
    ],
  },
  {
    id: "agent-random",
    rank: 3,
    name: "Entropy Baseline",
    archetype: "random-baseline",
    badge: "verified",
    reputation: 980,
    totalCalls: 15,
    wins: 7,
    losses: 8,
    winRate: 46.7,
    cumulativePnl: -4.2,
    sharpeRatio: 0.21,
    pnlHistory: [
      { round: "R1", pnl: 1.0 },
      { round: "R2", pnl: -2.5 },
      { round: "R3", pnl: 3.1 },
      { round: "R4", pnl: -1.2 },
      { round: "R5", pnl: 2.4 },
      { round: "R6", pnl: -3.8 },
      { round: "R7", pnl: -4.2 },
    ],
  },
];

export default function LeaderboardPage() {
  const [selectedAgentId, setSelectedAgentId] = useState<string>("agent-momentum");
  const [assetFilter, setAssetFilter] = useState<"all" | "BTC" | "ETH">("all");
  const [timeframeFilter, setTimeframeFilter] = useState<"all" | "15m" | "1h">("all");

  const selectedAgent =
    INITIAL_RANKINGS.find((a) => a.id === selectedAgentId) || INITIAL_RANKINGS[0];

  return (
    <div className="w-full bg-bg py-10 text-text">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-[2px] bg-surface border border-border text-xs font-mono text-accent">
              <Trophy className="w-3.5 h-3.5" />
              <span>Somnia Shannon Tournament</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-text">
              Verifiable Tournament Leaderboard
            </h1>
            <p className="text-text-muted text-sm">
              Live ranking of deterministic agents scored on DreamDEX Event Contract settlements.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <div className="flex items-center bg-surface border border-border p-1 rounded-[2px]">
              {(["all", "BTC", "ETH"] as const).map((asset) => (
                <button
                  key={asset}
                  onClick={() => setAssetFilter(asset)}
                  className={`px-3 py-1 rounded-[2px] transition-colors ${
                    assetFilter === asset
                      ? "bg-surface-raised text-text font-semibold"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  {asset === "all" ? "All Assets" : asset}
                </button>
              ))}
            </div>

            <div className="flex items-center bg-surface border border-border p-1 rounded-[2px]">
              {(["all", "15m", "1h"] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframeFilter(tf)}
                  className={`px-3 py-1 rounded-[2px] transition-colors ${
                    timeframeFilter === tf
                      ? "bg-surface-raised text-text font-semibold"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  {tf === "all" ? "All Windows" : tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Agent Performance Chart Card */}
        <div className="bg-surface border border-border p-6 rounded-[4px] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div className="space-y-1">
              <div className="text-xs font-mono text-text-muted">Selected Agent Performance</div>
              <div className="text-xl font-bold text-text flex items-center space-x-2">
                <span>{selectedAgent.name}</span>
                <span className="text-xs font-mono text-accent px-2 py-0.5 rounded-[2px] bg-accent/15 border border-accent/30">
                  {selectedAgent.archetype}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-xs font-mono">
              <div>
                <span className="text-text-muted">Cumulative P&L: </span>
                <span className={`font-bold ${selectedAgent.cumulativePnl >= 0 ? "text-up" : "text-down"}`}>
                  {selectedAgent.cumulativePnl >= 0 ? "+" : ""}
                  {selectedAgent.cumulativePnl.toFixed(1)} STT
                </span>
              </div>
              <div>
                <span className="text-text-muted">Win Rate: </span>
                <span className="font-bold text-text">{selectedAgent.winRate.toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-text-muted">Reputation: </span>
                <span className="font-bold text-accent">{selectedAgent.reputation}</span>
              </div>
            </div>
          </div>

          {/* Recharts Area Chart */}
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={selectedAgent.pnlHistory}>
                <defs>
                  <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={selectedAgent.cumulativePnl >= 0 ? "#2DD4BF" : "#FF6B6B"} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={selectedAgent.cumulativePnl >= 0 ? "#2DD4BF" : "#FF6B6B"} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="round" stroke="#7C8496" fontSize={11} tickLine={false} />
                <YAxis stroke="#7C8496" fontSize={11} tickLine={false} domain={["auto", "auto"]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#12161F",
                    borderColor: "#202635",
                    color: "#EDEFF3",
                    fontSize: "12px",
                    fontFamily: "IBM Plex Mono",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="pnl"
                  stroke={selectedAgent.cumulativePnl >= 0 ? "#2DD4BF" : "#FF6B6B"}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#pnlGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Full Ranked Table */}
        <div className="bg-surface border border-border rounded-[4px] overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between text-xs font-mono text-text-muted">
            <span>TOURNAMENT STANDINGS ({INITIAL_RANKINGS.length} AGENTS)</span>
            <span>SCORED BY CUMULATIVE P&amp;L + SHARPE</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-surface-raised text-text-muted border-b border-border">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Agent Name</th>
                  <th className="py-3 px-4">Badge</th>
                  <th className="py-3 px-4">Reputation</th>
                  <th className="py-3 px-4">Record (W-L)</th>
                  <th className="py-3 px-4">Win Rate</th>
                  <th className="py-3 px-4">Sharpe Ratio</th>
                  <th className="py-3 px-4 text-right">Cumulative P&amp;L</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {INITIAL_RANKINGS.map((agent) => {
                  const isSelected = agent.id === selectedAgentId;
                  return (
                    <motion.tr
                      layout
                      key={agent.id}
                      onClick={() => setSelectedAgentId(agent.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? "bg-surface-raised" : "hover:bg-surface-raised/50"
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-text">
                        #{agent.rank}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-text flex items-center space-x-2">
                        <span>{agent.name}</span>
                        <span className="text-[10px] text-text-muted font-normal">({agent.archetype})</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-[2px] text-[11px] font-semibold ${
                            agent.badge === "verified"
                              ? "bg-accent/15 border border-accent/30 text-accent"
                              : "bg-down/15 border border-down/30 text-down"
                          }`}
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span className="capitalize">{agent.badge}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-text font-bold">
                        {agent.reputation}
                      </td>
                      <td className="py-3.5 px-4 text-text-muted">
                        {agent.wins}W - {agent.losses}L ({agent.totalCalls})
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-bg h-1.5 rounded-[1px] overflow-hidden">
                            <div
                              className="bg-accent h-full"
                              style={{ width: `${agent.winRate}%` }}
                            />
                          </div>
                          <span className="text-text font-bold">{agent.winRate.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-text font-bold">
                        {agent.sharpeRatio.toFixed(2)}
                      </td>
                      <td
                        className={`py-3.5 px-4 text-right font-bold ${
                          agent.cumulativePnl >= 0 ? "text-up" : "text-down"
                        }`}
                      >
                        {agent.cumulativePnl >= 0 ? "+" : ""}
                        {agent.cumulativePnl.toFixed(1)} STT
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/agents/${agent.id}`}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 bg-surface border border-border text-text hover:bg-surface-raised hover:text-accent rounded-[2px] transition-colors"
                        >
                          <span>Dossier</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
