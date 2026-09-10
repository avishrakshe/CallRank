"use client";

import React, { useState } from "react";
import { useLiveFeed } from "@/hooks/useLiveFeed";
import { PriceChart } from "./PriceChart";
import { CountdownRing } from "./CountdownRing";
import { OrderBookDepth } from "./OrderBookDepth";
import { LiveActivityTicker } from "./LiveActivityTicker";
import { AgentCard } from "./AgentCard";
import { Leaderboard } from "./Leaderboard";
import { ProofPanel } from "./ProofPanel";
import { AudioCuesToggle } from "./AudioCuesToggle";
import { AssetSymbol, CallItem } from "@callrank/dreamdex-client/types";
import {
  Flame,
  Activity,
  Layers,
  Award,
  Wallet,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export function MarketTerminal() {
  const [selectedAsset, setSelectedAsset] = useState<AssetSymbol>("BTC");
  const [selectedProofCall, setSelectedProofCall] = useState<CallItem | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);

  const {
    btcPrice,
    ethPrice,
    orderBook,
    activeCalls,
    recentSettlements,
    activities,
    rankings,
    isConnected,
    addHumanChallenge,
  } = useLiveFeed(selectedAsset);

  const currentPrice = selectedAsset === "BTC" ? btcPrice : ethPrice;
  const now = Date.now();
  const next15mExpiry = now + (900000 - (now % 900000));
  const next1hExpiry = now + (3600000 - (now % 3600000));

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col terminal-grid selection:bg-primary selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-border/80 bg-surface/90 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                  CallRank <span className="text-primary text-sm font-mono">ARENA</span>
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/20 text-indigo-300 border border-primary/30">
                  Somnia × DreamDEX
                </span>
              </div>
              <p className="text-[11px] text-slate-400">The leaderboard for verifiable market calls</p>
            </div>
          </div>

          {/* Asset Selector Tabs */}
          <div className="hidden sm:flex items-center space-x-1 bg-surface-raised p-1 rounded-lg border border-border">
            {(["BTC", "ETH"] as const).map((sym) => (
              <button
                key={sym}
                onClick={() => setSelectedAsset(sym)}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                  selectedAsset === sym
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {sym}
              </button>
            ))}
          </div>
        </div>

        {/* Network & Wallet Controls */}
        <div className="flex items-center space-x-3">
          {/* Somnia Shannon Testnet Badge */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1 rounded-lg bg-surface-raised border border-border text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium">Somnia Shannon (50312)</span>
          </div>

          {/* Audio Cues Toggle */}
          <AudioCuesToggle />

          {/* Wallet Connect Button */}
          <button
            onClick={() => setWalletConnected(!walletConnected)}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              walletConnected
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30"
                : "bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/20"
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>{walletConnected ? "0x71C...B9a4 (4.5 STT)" : "Connect Wallet"}</span>
          </button>
        </div>
      </header>

      {/* Live Activity Ticker Strip */}
      <LiveActivityTicker activities={activities} />

      {/* Main Terminal Grid */}
      <main className="flex-1 p-4 md:p-6 grid grid-cols-1 xl:grid-cols-12 gap-5 max-w-[1720px] mx-auto w-full">
        {/* Left Column: Price Chart, Order Book Depth & Expiry Countdowns (7 cols) */}
        <section className="xl:col-span-7 flex flex-col space-y-5">
          {/* Live Candlestick Chart */}
          <div className="h-[430px]">
            <PriceChart asset={selectedAsset} currentPrice={currentPrice} />
          </div>

          {/* Order Book Depth & Fixed-Window Expiry Countdowns */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1">
            <div className="md:col-span-7 h-[250px]">
              <OrderBookDepth data={orderBook} marketSymbol={`${selectedAsset}-15M`} />
            </div>

            <div className="md:col-span-5 grid grid-cols-2 gap-3 h-[250px]">
              <CountdownRing
                targetTimestamp={next15mExpiry}
                totalDurationSeconds={900}
                label={`${selectedAsset} 15m Event`}
              />
              <CountdownRing
                targetTimestamp={next1hExpiry}
                totalDurationSeconds={3600}
                label={`${selectedAsset} 1h Event`}
              />
            </div>
          </div>
        </section>

        {/* Right Column: Active In-Flight Calls & Arena Tournament Leaderboard (5 cols) */}
        <section className="xl:col-span-5 flex flex-col space-y-5">
          {/* Active Agent Positions Strip */}
          <div className="glass-panel rounded-xl p-4 border border-border flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-border/70 mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/30">
                  <Activity className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider">Live Agent Market Calls</h3>
                  <p className="text-[11px] text-slate-400">Open deterministic positions with human challenge</p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                {activeCalls.length} Active
              </span>
            </div>

            {/* List of active Agent Cards */}
            <div className="space-y-3">
              {activeCalls.map((call) => (
                <AgentCard
                  key={call.id}
                  call={call}
                  ranking={rankings.find((r) => r.agentId === call.agentId)}
                  onChallenge={addHumanChallenge}
                  onSelectProof={(c) => setSelectedProofCall(c)}
                />
              ))}
            </div>
          </div>

          {/* Tournament Arena Leaderboard */}
          <div className="flex-1 min-h-[320px]">
            <Leaderboard rankings={rankings} />
          </div>

          {/* Recent Verifiable Settlements Feed */}
          {recentSettlements.length > 0 && (
            <div className="glass-panel rounded-xl p-4 border border-border">
              <div className="flex items-center justify-between pb-2 border-b border-border/70 mb-2">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase">Recent Settled Proofs</span>
                <span className="text-[10px] font-mono text-slate-500">Auto-Oracle Settlement</span>
              </div>
              <div className="space-y-2">
                {recentSettlements.slice(0, 3).map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedProofCall(s)}
                    className="flex items-center justify-between p-2 rounded-lg bg-surface-raised/40 hover:bg-surface-raised border border-border/60 cursor-pointer text-xs font-mono transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          s.resolution === "won" ? "bg-emerald-400" : "bg-rose-400"
                        }`}
                      />
                      <span className="font-bold text-white">{s.agentName}</span>
                      <span className="text-slate-400">
                        {s.asset} {s.direction.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-[11px]">
                      <span className={s.resolution === "won" ? "text-emerald-400 font-bold" : "text-rose-400"}>
                        {s.resolution?.toUpperCase()}
                      </span>
                      <ChevronRight className="w-3 h-3 text-slate-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Proof Modal / Audit Panel */}
      <ProofPanel call={selectedProofCall} onClose={() => setSelectedProofCall(null)} />

      {/* Footer */}
      <footer className="border-t border-border/70 bg-surface/80 py-3 px-6 text-center text-xs font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>CallRank Arena · Somnia × DreamDEX Event Contracts Hackathon</div>
        <div className="flex items-center space-x-4">
          <a
            href="https://docs.dreamdex.io"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary transition-colors flex items-center gap-1"
          >
            DreamDEX Docs <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://shannon-explorer.somnia.network"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary transition-colors flex items-center gap-1"
          >
            Shannon Explorer <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://github.com/avishrakshe/CallRank"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary transition-colors flex items-center gap-1"
          >
            GitHub Repo <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </div>
  );
}
