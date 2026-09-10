"use client";

import React, { useState } from "react";
import { useLiveFeed } from "@/hooks/useLiveFeed";
import { PriceChart } from "./PriceChart";
import { CountdownRing } from "./CountdownRing";
import { OrderBookDepth } from "./OrderBookDepth";
import { Leaderboard } from "./Leaderboard";
import { ProofPanel } from "./ProofPanel";
import { AudioCuesToggle } from "./AudioCuesToggle";
import { LiveActivityTicker } from "./LiveActivityTicker";
import { AssetSymbol, CallItem } from "@callrank/dreamdex-client/types";
import {
  ArrowLeft,
  SlidersHorizontal,
  Plus,
  AlertCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Layers,
  Sparkles,
  UserCheck,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MarketTerminal() {
  const [selectedAsset, setSelectedAsset] = useState<AssetSymbol>("BTC");
  const [selectedProofCall, setSelectedProofCall] = useState<CallItem | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [activeTab, setActiveTab] = useState<"terminal" | "calls" | "leaderboard">("terminal");
  const [selectedCallId, setSelectedCallId] = useState<string>("call-1");

  const {
    btcPrice,
    ethPrice,
    orderBook,
    activeCalls,
    recentSettlements,
    activities,
    rankings,
    addHumanChallenge,
  } = useLiveFeed(selectedAsset);

  const currentPrice = selectedAsset === "BTC" ? btcPrice : ethPrice;
  const activeCall = activeCalls.find((c) => c.id === selectedCallId) || activeCalls[0];

  const now = Date.now();
  const next15mExpiry = now + (900000 - (now % 900000));
  const next1hExpiry = now + (3600000 - (now % 3600000));

  const handleChallenge = (call: CallItem) => {
    const userAddr = "0x71C...B9a4";
    addHumanChallenge(call.id, userAddr);
  };

  return (
    <div className="w-full bg-bg text-text min-h-screen flex flex-col">
      {/* 1. TOP LIVE ACTIVITY TICKER TAPE */}
      <LiveActivityTicker activities={activities} />

      {/* 2. MAIN CONTAINER */}
      <div className="max-w-[1540px] mx-auto w-full px-4 sm:px-6 py-6 space-y-6 flex-1 flex flex-col">
        
        {/* Terminal Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
          {/* Asset Selector Tabs */}
          <div className="flex items-center space-x-2 font-mono text-xs">
            <button
              onClick={() => setSelectedAsset("BTC")}
              className={`px-3.5 py-2 rounded-[2px] border transition-all flex items-center space-x-2 ${
                selectedAsset === "BTC"
                  ? "bg-surface text-text border-accent/60 font-bold shadow-sm"
                  : "bg-surface-raised text-text-muted border-border hover:text-text"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span>BTC:USDso</span>
              <span className="text-text tabular-nums font-bold">
                ${btcPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </button>

            <button
              onClick={() => setSelectedAsset("ETH")}
              className={`px-3.5 py-2 rounded-[2px] border transition-all flex items-center space-x-2 ${
                selectedAsset === "ETH"
                  ? "bg-surface text-text border-accent/60 font-bold shadow-sm"
                  : "bg-surface-raised text-text-muted border-border hover:text-text"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span>ETH:USDso</span>
              <span className="text-text tabular-nums font-bold">
                ${ethPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </button>
          </div>

          {/* Quick Stats & Controls */}
          <div className="flex items-center space-x-4 font-mono text-xs">
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-surface border border-border rounded-[2px]">
              <span className="w-2 h-2 rounded-full bg-up animate-pulse" />
              <span className="text-text-muted">DreamDEX Fixed Window:</span>
              <span className="text-text font-bold">15m &amp; 1h</span>
            </div>

            <div className="flex items-center space-x-1 bg-surface-raised p-1 rounded-[2px] border border-border">
              <button
                onClick={() => setActiveTab("terminal")}
                className={`px-3 py-1 rounded-[2px] transition-colors ${
                  activeTab === "terminal"
                    ? "bg-surface text-text font-bold border border-border"
                    : "text-text-muted hover:text-text"
                }`}
              >
                Terminal
              </button>
              <button
                onClick={() => setActiveTab("calls")}
                className={`px-3 py-1 rounded-[2px] transition-colors ${
                  activeTab === "calls"
                    ? "bg-surface text-text font-bold border border-border"
                    : "text-text-muted hover:text-text"
                }`}
              >
                In-Flight Calls ({activeCalls.length})
              </button>
              <button
                onClick={() => setActiveTab("leaderboard")}
                className={`px-3 py-1 rounded-[2px] transition-colors ${
                  activeTab === "leaderboard"
                    ? "bg-surface text-text font-bold border border-border"
                    : "text-text-muted hover:text-text"
                }`}
              >
                Tournament Standings
              </button>
            </div>
          </div>
        </div>

        {/* 3. ASYMMETRIC GRID: Left Dominant (~64%) + Right Sidebar (~36%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT DOMINANT COLUMN (~64%) */}
          <div className="lg:col-span-8 flex flex-col space-y-6">
            
            {/* Live Candlestick & Spot Feed Chart */}
            <div className="w-full">
              <PriceChart asset={selectedAsset} currentPrice={currentPrice} />
            </div>

            {/* In-Flight Active Calls on this Market */}
            <div className="bg-surface border border-border rounded-[4px] p-5 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-up animate-pulse" />
                  <span className="font-bold text-text text-sm">Active In-Flight Calls</span>
                  <span className="text-text-muted">({activeCalls.length} live positions)</span>
                </div>
                <span className="text-[11px] text-text-muted">
                  Fixed 15m Expiries · Somnia Shannon
                </span>
              </div>

              <div className="space-y-3">
                {activeCalls.map((call) => (
                  <div
                    key={call.id}
                    className="p-4 bg-surface-raised border border-border rounded-[2px] hover:border-accent/40 transition-colors space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-text text-sm">{call.agentName}</span>
                        <span className="px-2 py-0.5 rounded-[2px] bg-accent/15 border border-accent/30 text-accent text-[10px] font-semibold">
                          {call.agentArchetype}
                        </span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded-[2px] text-xs ${
                            call.direction === "up"
                              ? "bg-up/15 text-up border border-up/30"
                              : "bg-down/15 text-down border border-down/30"
                          }`}
                        >
                          {call.asset} {call.direction.toUpperCase()} @ {call.entryPrice.toFixed(3)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {call.userAddress ? (
                          <span className="px-2.5 py-1 rounded-[2px] bg-accent/20 border border-accent/40 text-accent text-xs flex items-center space-x-1">
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Challenged by {call.userAddress.slice(0, 6)}</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleChallenge(call)}
                            className="px-3 py-1 bg-surface hover:bg-accent hover:text-bg text-text border border-border rounded-[2px] transition-all font-semibold"
                          >
                            Take the other side
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedProofCall(call)}
                          className="px-2.5 py-1 bg-surface hover:bg-surface-raised text-text-muted hover:text-text border border-border rounded-[2px] transition-colors"
                        >
                          Audit Proof
                        </button>
                      </div>
                    </div>

                    {/* Pre-Settlement Stated Reasoning */}
                    <div className="p-2.5 bg-bg border border-border rounded-[2px] text-text-muted text-[11px] leading-relaxed">
                      <span className="text-text font-semibold">Pre-Settlement Reasoning: </span>
                      &ldquo;{call.reasoning}&rdquo;
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-text-muted pt-1">
                      <span>Position size: {call.positionSize} contracts</span>
                      <span>Tx: {call.orderTxHash ? `${call.orderTxHash.slice(0, 14)}...` : "Pending on-chain"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR COLUMN (~36%) */}
          <div className="lg:col-span-4 flex flex-col space-y-6">
            
            {/* Fixed-Window Countdown Ring */}
            <div className="bg-surface border border-border p-5 rounded-[4px] space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2 text-xs font-mono">
                <span className="font-bold text-text">Contract Expiry Countdown</span>
                <span className="text-accent">Live Tick</span>
              </div>
              <CountdownRing
                targetTimestamp={next15mExpiry}
                totalDurationSeconds={900}
                label={`${selectedAsset} 15-Minute Event Contract`}
                size={110}
              />
            </div>

            {/* Order Book Depth Component */}
            <div className="bg-surface border border-border p-4 rounded-[4px] h-[340px]">
              <OrderBookDepth data={orderBook} marketSymbol={`${selectedAsset}-15M`} />
            </div>

            {/* Agent Pulse Status Rail */}
            <div className="bg-surface border border-border p-5 rounded-[4px] space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="font-bold text-text">Agent Pulse Rail</span>
                <span className="text-text-muted">3 Autonomous Agents</span>
              </div>

              <div className="space-y-3">
                {rankings.map((r) => {
                  const hasExposure = activeCalls.some((c) => c.agentId === r.agentId);
                  return (
                    <div
                      key={r.agentId}
                      className="p-3 bg-surface-raised border border-border rounded-[2px] flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              hasExposure ? "bg-up animate-pulse" : "bg-text-muted"
                            }`}
                          />
                          <span className="font-bold text-text">{r.name}</span>
                        </div>
                        <div className="text-[11px] text-text-muted">
                          Win Rate: {(r.winRate * 100).toFixed(1)}% ({r.wins}W - {r.losses}L)
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-accent">{r.reputation} pts</div>
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded-[2px] text-[10px] uppercase font-semibold ${
                            r.badge === "verified"
                              ? "bg-accent/15 text-accent border border-accent/30"
                              : "bg-down/15 text-down border border-down/30"
                          }`}
                        >
                          {r.badge}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {/* 4. TOURNAMENT LEADERBOARD SECTION */}
        <div className="w-full pt-4">
          <Leaderboard rankings={rankings} />
        </div>

      </div>

      {/* 5. AUDIT PROOF SLIDE-OVER PANEL */}
      <AnimatePresence>
        {selectedProofCall && (
          <ProofPanel
            call={selectedProofCall}
            onClose={() => setSelectedProofCall(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
