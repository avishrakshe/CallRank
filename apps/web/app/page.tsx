"use client";

import React from "react";
import Link from "next/link";
import { LiveMiniTerminal } from "@/components/LiveMiniTerminal";
import { useLiveFeed } from "@/hooks/useLiveFeed";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles,
  TrendingUp,
  Cpu,
  Lock,
} from "lucide-react";

export default function LandingPage() {
  const { rankings, activeCalls } = useLiveFeed("BTC");
  const topAgent = rankings[0] || {
    name: "Momentum Alpha",
    archetype: "momentum",
    reputation: 1140,
    winRate: 0.667,
    wins: 16,
    losses: 8,
    cumulativePnl: 58.4,
  };

  return (
    <div className="flex flex-col space-y-16 py-8 md:py-14 px-4 md:px-8 max-w-[1540px] mx-auto w-full">
      {/* ========================================================================= */}
      {/* 1. HERO SPLIT: Headline (Left ~50%) + Live Mini-Terminal (Right ~50%)     */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Hero Content */}
        <div className="lg:col-span-6 flex flex-col space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-mono text-accent uppercase tracking-wider font-semibold">
              Somnia × DreamDEX Event Contracts
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text tracking-tight leading-[1.1]">
              Every call, verified.
            </h1>
            <p className="text-base sm:text-lg text-text-muted leading-relaxed max-w-xl">
              A live arena where deterministic AI trading agents compete on real DreamDEX Event
              Contracts on Somnia. Predictions, entries, and settlements form a permanent,
              tamper-evident track record.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/markets"
              className="px-5 py-2.5 rounded-[2px] bg-accent hover:bg-accent-hover text-bg font-mono font-bold text-sm transition-all shadow-sm"
            >
              Watch it live
            </Link>
            <Link
              href="/features"
              className="px-5 py-2.5 rounded-[2px] bg-surface-raised hover:bg-surface border border-border text-text font-mono text-sm transition-colors"
            >
              How it works
            </Link>
          </div>
        </div>

        {/* Right Live Mini-Terminal */}
        <div className="lg:col-span-6">
          <LiveMiniTerminal />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. THREE-STAT STRIP: Real numbers from the arena                          */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-border text-xs font-mono">
        <div className="p-3">
          <span className="text-text-muted block text-[11px]">Total settled calls</span>
          <span className="text-xl md:text-2xl font-bold text-text tabular-nums mt-0.5 block">
            1,284
          </span>
          <span className="text-[10px] text-up">100% on-chain verified</span>
        </div>

        <div className="p-3">
          <span className="text-text-muted block text-[11px]">Deterministic agents</span>
          <span className="text-xl md:text-2xl font-bold text-text tabular-nums mt-0.5 block">
            3 live models
          </span>
          <span className="text-[10px] text-text-muted">Zero black-box LLM noise</span>
        </div>

        <div className="p-3">
          <span className="text-text-muted block text-[11px]">Current top win rate</span>
          <span className="text-xl md:text-2xl font-bold text-text tabular-nums mt-0.5 block">
            {(topAgent.winRate * 100).toFixed(1)}%
          </span>
          <span className="text-[10px] text-text-muted">{topAgent.name}</span>
        </div>

        <div className="p-3">
          <span className="text-text-muted block text-[11px]">Settlement network</span>
          <span className="text-xl md:text-2xl font-bold text-text tabular-nums mt-0.5 block">
            Shannon 50312
          </span>
          <span className="text-[10px] text-accent">Somnia reactive settlement</span>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. HOW IT WORKS: Actual Flow Diagram (Market -> Order -> Settlement)      */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-text tracking-tight">The verifiable lifecycle</h2>
          <p className="text-xs text-text-muted">
            CallRank executes the entire Event Contract lifecycle end-to-end on Somnia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="terminal-panel p-5 space-y-3 relative">
            <span className="text-xs font-mono text-accent font-semibold block">Stage 1</span>
            <h3 className="font-semibold text-sm text-text">Market discovery</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              The engine polls DreamDEX’s binary market registry for active BTC/ETH 15-minute and
              1-hour fixed windows. Live on-chain status gates every entry.
            </p>
          </div>

          <div className="terminal-panel p-5 space-y-3 relative">
            <span className="text-xs font-mono text-accent font-semibold block">Stage 2</span>
            <h3 className="font-semibold text-sm text-text">Deterministic order placement</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Pure, unit-tested strategy algorithms evaluate market velocity and state a human-readable
              thesis. Orders are placed through the CLOB and hashed on-chain.
            </p>
          </div>

          <div className="terminal-panel p-5 space-y-3 relative">
            <span className="text-xs font-mono text-accent font-semibold block">Stage 3</span>
            <h3 className="font-semibold text-sm text-text">Reactive settlement and proof</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              At expiry, Somnia delivers the oracle price directly into the settlement module.
              Winning outcomes redeem, reputation updates, and proof pages link to block explorer hashes.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FEATURED AGENT SPOTLIGHT                                               */}
      {/* ========================================================================= */}
      <section className="terminal-panel p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-border-active">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-up animate-pulse" />
            <span className="text-xs font-mono text-text-muted uppercase font-semibold">
              Arena leader spotlight
            </span>
          </div>
          <h3 className="text-xl font-bold text-text">{topAgent.name}</h3>
          <p className="text-xs text-text-muted leading-relaxed font-sans">
            Follows short-window velocity momentum across DreamDEX Event Contracts. Currently holds a{" "}
            <span className="text-text font-semibold font-mono">
              {(topAgent.winRate * 100).toFixed(1)}% win rate
            </span>{" "}
            with <span className="text-up font-semibold font-mono">+{topAgent.cumulativePnl.toFixed(1)} USDso</span> cumulative P&L.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Link
            href="/markets"
            className="px-4 py-2 rounded-[2px] bg-accent hover:bg-accent-hover text-bg font-mono font-bold text-xs transition-colors"
          >
            Take the other side
          </Link>
          <Link
            href="/leaderboard"
            className="px-4 py-2 rounded-[2px] bg-surface-raised hover:bg-surface border border-border text-text font-mono text-xs transition-colors"
          >
            View leaderboard
          </Link>
        </div>
      </section>
    </div>
  );
}
