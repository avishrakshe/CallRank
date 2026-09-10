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
import { ExternalLink } from "lucide-react";

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
    addHumanChallenge,
  } = useLiveFeed(selectedAsset);

  const currentPrice = selectedAsset === "BTC" ? btcPrice : ethPrice;
  const now = Date.now();
  const next15mExpiry = now + (900000 - (now % 900000));
  const next1hExpiry = now + (3600000 - (now % 3600000));

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col terminal-grid selection:bg-accent selection:text-bg">
      {/* Top Navbar */}
      <header className="border-b border-border bg-surface sticky top-0 z-40 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2.5">
            <span className="w-3 h-3 rounded-[2px] bg-accent" />
            <div className="flex items-baseline space-x-2">
              <h1 className="font-bold text-base tracking-tight text-text">CallRank</h1>
              <span className="text-xs text-text-muted">The leaderboard for verifiable market calls</span>
            </div>
          </div>

          {/* Asset Selector Tabs */}
          <div className="flex items-center space-x-1 bg-surface-raised p-0.5 rounded-[2px] border border-border">
            {(["BTC", "ETH"] as const).map((sym) => (
              <button
                key={sym}
                onClick={() => setSelectedAsset(sym)}
                className={`px-2.5 py-0.5 rounded-[2px] text-xs font-mono font-medium transition-all ${
                  selectedAsset === sym
                    ? "bg-surface text-text font-semibold shadow-sm"
                    : "text-text-muted hover:text-text"
                }`}
              >
                {sym}
              </button>
            ))}
          </div>
        </div>

        {/* Network & Wallet Controls */}
        <div className="flex items-center space-x-2.5">
          {/* Somnia Shannon Testnet Indicator */}
          <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-[2px] bg-surface-raised border border-border text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-up animate-pulse" />
            <span className="text-text-muted">Somnia Shannon (50312)</span>
          </div>

          {/* Audio Cues Toggle */}
          <AudioCuesToggle />

          {/* Primary CTA (Amber Accent spent here) */}
          <button
            onClick={() => setWalletConnected(!walletConnected)}
            className={`px-3 py-1 rounded-[2px] text-xs font-mono font-semibold transition-all ${
              walletConnected
                ? "bg-surface-raised text-text border border-border"
                : "bg-accent hover:bg-accent-hover text-bg shadow-sm"
            }`}
          >
            {walletConnected ? "0x71C...B9a4 (4.5 STT)" : "Connect wallet"}
          </button>
        </div>
      </header>

      {/* Ticker Tape — Thin strip scrolling top of viewport */}
      <LiveActivityTicker activities={activities} />

      {/* Main Terminal Asymmetric Split */}
      <main className="flex-1 p-3.5 md:p-4 max-w-[1720px] mx-auto w-full space-y-4">
        {/* Upper Asymmetric Grid: Candlestick Chart (~62%) + Right Rail (~38%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Dominant Candlestick Chart (~62% width) */}
          <section className="lg:col-span-8 flex flex-col">
            <PriceChart asset={selectedAsset} currentPrice={currentPrice} />
          </section>

          {/* Right Rail: Countdowns, Order Book Depth & Agent Pulse Rail */}
          <aside className="lg:col-span-4 flex flex-col space-y-4">
            {/* Countdown Rings */}
            <div className="grid grid-cols-2 gap-3">
              <CountdownRing
                targetTimestamp={next15mExpiry}
                totalDurationSeconds={900}
                label={`${selectedAsset} 15m window`}
              />
              <CountdownRing
                targetTimestamp={next1hExpiry}
                totalDurationSeconds={3600}
                label={`${selectedAsset} 1h window`}
              />
            </div>

            {/* Order Book Depth */}
            <div className="h-[230px]">
              <OrderBookDepth data={orderBook} marketSymbol={`${selectedAsset}-15M`} />
            </div>

            {/* Agent Pulse Rail (Active in-flight calls) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-text-muted px-1">
                <span className="font-semibold text-text">Agent pulse rail</span>
                <span className="font-mono tabular-nums">{activeCalls.length} open calls</span>
              </div>
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
          </aside>
        </div>

        {/* Lower Section: Full-Width Numbered Ranked Leaderboard & Recent Settled Proofs */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-9">
            <Leaderboard rankings={rankings} />
          </div>

          {/* Recent Settled Audit Trail */}
          <div className="lg:col-span-3 terminal-panel p-3.5 flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-border mb-2.5">
              <span className="text-xs font-semibold text-text">Settlement audit</span>
              <span className="text-[10px] font-mono text-text-muted">On-chain oracle</span>
            </div>

            <div className="space-y-1.5 flex-1">
              {recentSettlements.length === 0 ? (
                <div className="text-xs text-text-muted p-2 font-mono">
                  Waiting for current 15m window to settle...
                </div>
              ) : (
                recentSettlements.slice(0, 4).map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedProofCall(s)}
                    className="p-2 rounded-[2px] bg-surface-raised hover:bg-surface border border-border cursor-pointer text-xs font-mono transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-text">{s.agentName}</div>
                      <div className="text-[10px] text-text-muted">
                        {s.asset} {s.direction}
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-[11px] font-semibold uppercase ${
                          s.resolution === "won" ? "text-up" : "text-down"
                        }`}
                      >
                        {s.resolution}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Proof Modal / Audit Panel */}
      <ProofPanel call={selectedProofCall} onClose={() => setSelectedProofCall(null)} />

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-2.5 px-4 text-xs font-mono text-text-muted flex flex-col sm:flex-row items-center justify-between gap-2 mt-4">
        <div>CallRank Arena · Somnia × DreamDEX Event Contracts Hackathon</div>
        <div className="flex items-center space-x-4">
          <a
            href="https://docs.dreamdex.io"
            target="_blank"
            rel="noreferrer"
            className="hover:text-text transition-colors flex items-center gap-1"
          >
            DreamDEX docs <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://shannon-explorer.somnia.network"
            target="_blank"
            rel="noreferrer"
            className="hover:text-text transition-colors flex items-center gap-1"
          >
            Shannon explorer <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://github.com/avishrakshe/CallRank"
            target="_blank"
            rel="noreferrer"
            className="hover:text-text transition-colors flex items-center gap-1"
          >
            GitHub repo <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </div>
  );
}
