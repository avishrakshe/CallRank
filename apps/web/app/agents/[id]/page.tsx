"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  ArrowUpRight,
  UserCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Code2,
  Flame,
} from "lucide-react";

interface AgentData {
  id: string;
  name: string;
  archetype: "momentum" | "contrarian" | "random-baseline";
  badge: "verified" | "unreliable";
  reputation: number;
  description: string;
  deterministicFormula: string;
  hasOpenPosition: boolean;
  openPositionText?: string;
  stats: {
    totalCalls: number;
    wins: number;
    losses: number;
    winRate: number;
    cumulativePnl: number;
    sharpeRatio: number;
    humanVsAiRecord: { humanWins: number; aiWins: number };
  };
  calls: {
    id: string;
    asset: string;
    direction: "up" | "down";
    windowSeconds: number;
    entrySpotPrice: number;
    entryTimestamp: string;
    expiryTimestamp: string;
    resolution: "won" | "lost" | "pending";
    payout: number;
    orderTxHash: string;
  }[];
}

const AGENTS_DATABASE: Record<string, AgentData> = {
  "agent-momentum": {
    id: "agent-momentum",
    name: "Momentum Alpha",
    archetype: "momentum",
    badge: "verified",
    reputation: 1140,
    description:
      "Detects short-window directional momentum across BTC and ETH Event Contracts. When price velocity exceeds 0.05% over recent ticks, it enters contracts in the direction of the velocity surge.",
    deterministicFormula:
      "ΔP = (Spot_now - Spot_t-N) / Spot_t-N. If ΔP > 0.05% => Direction: UP, Confidence = min(1.0, |ΔP| * 50).",
    hasOpenPosition: true,
    openPositionText: "BTC:USDso-15m UP @ 0.584 STT (Expires in 4:12)",
    stats: {
      totalCalls: 18,
      wins: 12,
      losses: 6,
      winRate: 66.7,
      cumulativePnl: 48.5,
      sharpeRatio: 1.84,
      humanVsAiRecord: { humanWins: 3, aiWins: 5 },
    },
    calls: [
      {
        id: "call-1",
        asset: "BTC",
        direction: "up",
        windowSeconds: 900,
        entrySpotPrice: 88410.5,
        entryTimestamp: "10 mins ago",
        expiryTimestamp: "in 5 mins",
        resolution: "pending",
        payout: 0,
        orderTxHash: "0x4f8a129c2ea5498877bc9321",
      },
      {
        id: "call-2",
        asset: "BTC",
        direction: "up",
        windowSeconds: 900,
        entrySpotPrice: 88120.0,
        entryTimestamp: "25 mins ago",
        expiryTimestamp: "10 mins ago",
        resolution: "won",
        payout: 8.4,
        orderTxHash: "0x7bc392110ea4958172da8921",
      },
      {
        id: "call-3",
        asset: "ETH",
        direction: "up",
        windowSeconds: 3600,
        entrySpotPrice: 2695.5,
        entryTimestamp: "1h 15m ago",
        expiryTimestamp: "15 mins ago",
        resolution: "won",
        payout: 12.5,
        orderTxHash: "0x12fbc9447218ca88921bba87",
      },
      {
        id: "call-4",
        asset: "BTC",
        direction: "down",
        windowSeconds: 900,
        entrySpotPrice: 88350.0,
        entryTimestamp: "2h ago",
        expiryTimestamp: "1h 45m ago",
        resolution: "lost",
        payout: -10.0,
        orderTxHash: "0x89ab1264cba309117621cda2",
      },
    ],
  },
  "agent-contrarian": {
    id: "agent-contrarian",
    name: "Contrarian Mean-Reversion",
    archetype: "contrarian",
    badge: "verified",
    reputation: 1080,
    description:
      "Identifies overextended momentum surges and places trades fading the spike. Assumes mean-reverting dynamics will pull contract prices back toward the 0.50 implied probability midpoint before window expiry.",
    deterministicFormula:
      "If ΔP > 0.08% => Direction: DOWN (Fading overbought). If ΔP < -0.08% => Direction: UP (Fading oversold).",
    hasOpenPosition: true,
    openPositionText: "ETH:USDso-15m DOWN @ 0.510 STT (Expires in 8:40)",
    stats: {
      totalCalls: 16,
      wins: 10,
      losses: 6,
      winRate: 62.5,
      cumulativePnl: 32.1,
      sharpeRatio: 1.52,
      humanVsAiRecord: { humanWins: 2, aiWins: 4 },
    },
    calls: [
      {
        id: "call-c1",
        asset: "ETH",
        direction: "down",
        windowSeconds: 900,
        entrySpotPrice: 2710.2,
        entryTimestamp: "7 mins ago",
        expiryTimestamp: "in 8 mins",
        resolution: "pending",
        payout: 0,
        orderTxHash: "0x55ca891102ba98721c45019a",
      },
      {
        id: "call-c2",
        asset: "BTC",
        direction: "down",
        windowSeconds: 900,
        entrySpotPrice: 88600.0,
        entryTimestamp: "35 mins ago",
        expiryTimestamp: "20 mins ago",
        resolution: "won",
        payout: 9.8,
        orderTxHash: "0x98bb3190ab7621876352cca1",
      },
    ],
  },
  "agent-random": {
    id: "agent-random",
    name: "Entropy Baseline",
    archetype: "random-baseline",
    badge: "verified",
    reputation: 980,
    description:
      "Control agent executing uniform pseudo-random choices seeded by market expiry timestamps. Used as a benchmark to mathematically prove that other agents possess true edge rather than statistical noise.",
    deterministicFormula:
      "Hash(MarketId, ExpiryTimestamp) % 2 === 0 ? UP : DOWN. Fixed confidence: 0.50.",
    hasOpenPosition: false,
    stats: {
      totalCalls: 15,
      wins: 7,
      losses: 8,
      winRate: 46.7,
      cumulativePnl: -4.2,
      sharpeRatio: 0.21,
      humanVsAiRecord: { humanWins: 4, aiWins: 3 },
    },
    calls: [
      {
        id: "call-r1",
        asset: "BTC",
        direction: "up",
        windowSeconds: 900,
        entrySpotPrice: 88200.0,
        entryTimestamp: "40 mins ago",
        expiryTimestamp: "25 mins ago",
        resolution: "lost",
        payout: -10.0,
        orderTxHash: "0x33ca4419aa765109b821ac33",
      },
    ],
  },
};

export default function AgentProfilePage() {
  const params = useParams();
  const agentId = (params?.id as string) || "agent-momentum";
  const agent = AGENTS_DATABASE[agentId] || AGENTS_DATABASE["agent-momentum"];

  return (
    <div className="w-full bg-bg py-10 text-text">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Top Back Link */}
        <Link
          href="/leaderboard"
          className="inline-flex items-center space-x-1.5 text-xs font-mono text-text-muted hover:text-text transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to leaderboard</span>
        </Link>

        {/* Hero Dossier Card */}
        <div className="bg-surface border border-border p-6 md:p-8 rounded-[4px] space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border pb-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text">
                  {agent.name}
                </h1>
                {/* Agent Pulse Indicator */}
                {agent.hasOpenPosition ? (
                  <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded-[2px] bg-up/15 border border-up/30 text-up text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-up animate-pulse" />
                    <span>In-flight call</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded-[2px] bg-surface-raised border border-border text-text-muted text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-text-muted" />
                    <span>Idle</span>
                  </span>
                )}
              </div>
              <p className="text-sm text-text-muted max-w-2xl leading-relaxed">
                {agent.description}
              </p>
            </div>

            {/* Reputation Badge */}
            <div className="flex flex-col items-end space-y-1">
              <span
                className={`inline-flex items-center space-x-1 px-3 py-1 rounded-[2px] text-xs font-mono font-semibold ${
                  agent.badge === "verified"
                    ? "bg-accent/15 border border-accent/30 text-accent"
                    : "bg-down/15 border border-down/30 text-down"
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="capitalize">{agent.badge} Agent</span>
              </span>
              <span className="text-xs font-mono text-text-muted">
                Reputation: <strong className="text-text font-bold">{agent.reputation}</strong> / 2000
              </span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-3 bg-surface-raised border border-border rounded-[2px] space-y-1">
              <div className="text-text-muted">Cumulative P&amp;L</div>
              <div className={`text-base font-bold ${agent.stats.cumulativePnl >= 0 ? "text-up" : "text-down"}`}>
                {agent.stats.cumulativePnl >= 0 ? "+" : ""}
                {agent.stats.cumulativePnl.toFixed(1)} STT
              </div>
            </div>

            <div className="p-3 bg-surface-raised border border-border rounded-[2px] space-y-1">
              <div className="text-text-muted">Win Rate</div>
              <div className="text-base font-bold text-text">
                {agent.stats.winRate.toFixed(1)}% ({agent.stats.wins}W / {agent.stats.losses}L)
              </div>
            </div>

            <div className="p-3 bg-surface-raised border border-border rounded-[2px] space-y-1">
              <div className="text-text-muted">Sharpe Ratio</div>
              <div className="text-base font-bold text-text">
                {agent.stats.sharpeRatio.toFixed(2)}
              </div>
            </div>

            <div className="p-3 bg-surface-raised border border-border rounded-[2px] space-y-1">
              <div className="text-text-muted">Human Challenge Record</div>
              <div className="text-base font-bold text-accent">
                {agent.stats.humanVsAiRecord.aiWins} AI wins / {agent.stats.humanVsAiRecord.humanWins} Human
              </div>
            </div>
          </div>

          {/* Deterministic Execution Formula */}
          <div className="p-4 bg-bg border border-border rounded-[2px] font-mono text-xs space-y-2">
            <div className="flex items-center space-x-2 text-text-muted">
              <Code2 className="w-4 h-4 text-accent" />
              <span className="font-semibold text-text">Deterministic Strategy Formula</span>
            </div>
            <div className="text-text-muted text-[11px] leading-relaxed">
              <code>{agent.deterministicFormula}</code>
            </div>
          </div>
        </div>

        {/* Call History Table */}
        <div className="bg-surface border border-border rounded-[4px] overflow-hidden space-y-0">
          <div className="p-4 border-b border-border flex items-center justify-between text-xs font-mono text-text-muted">
            <span>AUDITABLE CALL LOG ({agent.calls.length} CALLS)</span>
            <span>SETTLEMENT TRACKED ON SOMNIA SHANNON</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-surface-raised text-text-muted border-b border-border">
                <tr>
                  <th className="py-3 px-4">Call ID</th>
                  <th className="py-3 px-4">Asset &amp; Direction</th>
                  <th className="py-3 px-4">Window</th>
                  <th className="py-3 px-4">Spot Entry</th>
                  <th className="py-3 px-4">Resolution</th>
                  <th className="py-3 px-4">Payout</th>
                  <th className="py-3 px-4 text-right">Proof Page</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {agent.calls.map((call) => (
                  <tr key={call.id} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-text">
                      {call.id}
                    </td>
                    <td className="py-3.5 px-4 font-bold">
                      <span className={call.direction === "up" ? "text-up" : "text-down"}>
                        {call.asset} {call.direction.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-text-muted">
                      {call.windowSeconds / 60}m
                    </td>
                    <td className="py-3.5 px-4 text-text">
                      ${call.entrySpotPrice.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      {call.resolution === "won" ? (
                        <span className="text-up font-bold">WON</span>
                      ) : call.resolution === "lost" ? (
                        <span className="text-down font-bold">LOST</span>
                      ) : (
                        <span className="text-accent font-semibold flex items-center space-x-1">
                          <Clock className="w-3 h-3 animate-spin" />
                          <span>In Flight</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-text">
                      {call.resolution === "pending"
                        ? "--"
                        : `${call.payout >= 0 ? "+" : ""}${call.payout.toFixed(1)} STT`}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/proof/${call.id}`}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 bg-surface border border-border text-accent hover:bg-surface-raised rounded-[2px] transition-colors"
                      >
                        <span>Audit Proof</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
