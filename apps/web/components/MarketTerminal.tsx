"use client";

import React, { useState } from "react";
import { useLiveFeed } from "@/hooks/useLiveFeed";
import { PriceChart } from "./PriceChart";
import { CountdownRing } from "./CountdownRing";
import { OrderBookDepth } from "./OrderBookDepth";
import { Leaderboard } from "./Leaderboard";
import { ProofPanel } from "./ProofPanel";
import { AudioCuesToggle } from "./AudioCuesToggle";
import { AssetSymbol, CallItem } from "@callrank/dreamdex-client/types";
import {
  ArrowLeft,
  SlidersHorizontal,
  Plus,
  AlertCircle,
  Calendar,
  Clock,
  Lock,
  ArrowUpRight,
  Search,
  ChevronDown,
  FileText,
  Zap,
  Wallet,
  Bell,
  Settings,
  MoreVertical,
  LayoutGrid,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Layers,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

export function MarketTerminal() {
  const [selectedAsset, setSelectedAsset] = useState<AssetSymbol>("BTC");
  const [selectedProofCall, setSelectedProofCall] = useState<CallItem | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [activeTab, setActiveTab] = useState<"terminal" | "calls" | "chart" | "leaderboard">("calls");
  const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "active">("active");

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
  const [selectedCallId, setSelectedCallId] = useState<string>(activeCalls[0]?.id || "call-1");
  const activeCall = activeCalls.find((c) => c.id === selectedCallId) || activeCalls[0];

  const now = Date.now();
  const next15mExpiry = now + (900000 - (now % 900000));
  const next1hExpiry = now + (3600000 - (now % 3600000));

  return (
    <div className="min-h-screen bg-[#EEF0F5] p-3 sm:p-5 md:p-7 flex justify-center text-gray-900">
      {/* Outer Shell Card matching Finnova reference image */}
      <div className="w-full max-w-[1520px] bg-white rounded-[28px] md:rounded-[36px] shadow-sm border border-[#EAECEF] p-4 sm:p-6 md:p-8 flex flex-col space-y-6">
        
        {/* ========================================================================= */}
        {/* 1. TOP NAVBAR (Logo, Counter, Dark Pill Navigation, Quick Action Icons)    */}
        {/* ========================================================================= */}
        <header className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-gray-100">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-[#706EF2] flex items-center justify-center text-white font-black text-lg shadow-sm">
              C
            </div>
            <div>
              <div className="font-extrabold text-xl tracking-tight text-gray-900 flex items-center gap-1.5">
                CallRank
              </div>
              <div className="text-[11px] text-gray-400 font-medium">Smart Calls, Better Edge</div>
            </div>
            <div className="ml-2 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-mono font-bold">
              50312
            </div>
          </div>

          {/* Dark Center Pill Navigation Bar */}
          <nav className="finnova-nav-pill flex items-center space-x-1 text-xs font-medium">
            <button
              onClick={() => setActiveTab("calls")}
              className={`px-3.5 py-1.5 transition-all ${
                activeTab === "calls" ? "finnova-nav-active shadow-sm font-semibold" : "hover:text-white"
              }`}
            >
              • Calls
            </button>
            <button
              onClick={() => setActiveTab("chart")}
              className={`px-3.5 py-1.5 transition-all ${
                activeTab === "chart" ? "finnova-nav-active shadow-sm font-semibold" : "hover:text-white"
              }`}
            >
              Live Chart
            </button>
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`px-3.5 py-1.5 transition-all ${
                activeTab === "leaderboard" ? "finnova-nav-active shadow-sm font-semibold" : "hover:text-white"
              }`}
            >
              Leaderboard
            </button>
            <button
              onClick={() => setSelectedAsset((prev) => (prev === "BTC" ? "ETH" : "BTC"))}
              className="px-3 py-1.5 text-gray-400 hover:text-white"
            >
              Asset: {selectedAsset}
            </button>
          </nav>

          {/* Right Action Icons & Avatar */}
          <div className="flex items-center space-x-2">
            <AudioCuesToggle />
            <a
              href="https://docs.dreamdex.io"
              target="_blank"
              rel="noreferrer"
              title="DreamDEX Docs"
              className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 transition-colors"
            >
              <FileText className="w-4 h-4" />
            </a>
            <a
              href="https://shannon-explorer.somnia.network"
              target="_blank"
              rel="noreferrer"
              title="Somnia Shannon Explorer"
              className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 transition-colors"
            >
              <Zap className="w-4 h-4 text-amber-500" />
            </a>
            <div className="relative">
              <button
                onClick={() => setWalletConnected(!walletConnected)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-medium transition-all ${
                  walletConnected
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>{walletConnected ? "0x71C...B9a4" : "Connect"}</span>
              </button>
            </div>
            {/* User avatar circle */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-indigo-400 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              AV
            </div>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* 2. PAGE HEADER TITLE & PRIMARY ACTION ROW                                */}
        {/* ========================================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab("calls")}
              className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600 shadow-subtle transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Event Market Calls
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Manage and track all verifiable AI market calls in one arena.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setSelectedAsset((prev) => (prev === "BTC" ? "ETH" : "BTC"))}
              className="w-10 h-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-700 shadow-subtle transition-all"
              title="Switch BTC/ETH"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <button
              onClick={() => activeCall && addHumanChallenge(activeCall.id, "0x71C...B9a4")}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-xs sm:text-sm flex items-center space-x-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Take the other side</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. FOUR TOP ANALYTICS & METRICS CARDS (Exact match to Finnova top row)     */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Spot Reference Price */}
          <div className="finnova-card p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium mb-2">
                <span>{selectedAsset}/USD Spot Oracle</span>
                <AlertCircle className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-[28px] font-bold text-gray-900 font-mono tracking-tight tabular-nums">
                ${currentPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center space-x-1">
                <span className="font-bold">↑ 12.5%</span>
                <span className="text-gray-400">from last window</span>
              </div>
            </div>

            {/* Visual Graphic Representation */}
            <div className="mt-4 pt-3 border-t border-gray-50 flex items-end justify-between">
              <div className="text-[11px] text-gray-400 font-mono">Somnia Shannon Live</div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-mono font-bold">
                100% Verified
              </span>
            </div>
          </div>

          {/* Card 2: 24h Event Volume with Vertical Bars */}
          <div className="finnova-card p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium mb-2">
                <span>24h Event Volume</span>
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl sm:text-[28px] font-bold text-gray-900 font-mono tracking-tight tabular-nums">
                $142,560.00
              </div>
              <div className="text-xs text-primary font-medium mt-1 flex items-center space-x-1">
                <span className="font-bold">↑ 8.2%</span>
                <span className="text-gray-400">from last cycle</span>
              </div>
            </div>

            {/* Vertical Bar Chart matching Finnova */}
            <div className="mt-4 pt-2 flex items-end justify-between h-14 space-x-1.5">
              {[
                { label: "Jul", height: "45%" },
                { label: "Aug", height: "35%" },
                { label: "Sep", height: "65%" },
                { label: "Oct", height: "55%" },
                { label: "Nov", height: "85%" },
                { label: "Dec", height: "100%" },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-gray-100 rounded-t-sm h-12 relative overflow-hidden flex items-end">
                    <div
                      className="w-full bg-[#7A78F5] rounded-t-sm transition-all duration-500"
                      style={{ height: bar.height }}
                    />
                  </div>
                  <span className="text-[9px] text-gray-400 font-mono">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Fixed Settlement Window & Sparkline */}
          <div className="finnova-card p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium mb-2">
                <span>Average Settlement Time</span>
                <Clock className="w-4 h-4 text-cyan-500" />
              </div>
              <div className="text-2xl sm:text-[28px] font-bold text-gray-900 font-mono tracking-tight tabular-nums">
                14m 20s
              </div>
              <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center space-x-1">
                <span className="font-bold">↓ 2m</span>
                <span className="text-gray-400">from last cycle</span>
              </div>
            </div>

            {/* Curved SVG Sparkline with data points */}
            <div className="mt-4 pt-2 relative">
              <svg viewBox="0 0 200 45" className="w-full h-12 overflow-visible">
                <path
                  d="M 5,35 Q 35,38 65,22 T 125,18 T 175,8 T 195,5"
                  fill="none"
                  stroke="#7A78F5"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="65" cy="22" r="3" fill="#FFFFFF" stroke="#7A78F5" strokeWidth="2" />
                <circle cx="125" cy="18" r="3" fill="#FFFFFF" stroke="#7A78F5" strokeWidth="2" />
                <circle cx="175" cy="8" r="3" fill="#FFFFFF" stroke="#7A78F5" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Card 4: Available Staking & Multi-rail Cards */}
          <div className="finnova-card p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium mb-2">
                <span>Available Collateral Pool</span>
                <div className="flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-500" />
                  <ArrowUpRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-[28px] font-bold text-gray-900 font-mono tracking-tight tabular-nums">
                  $186,540.00
                </span>
                <span className="text-[11px] font-medium text-gray-400 font-mono">tUSDC</span>
              </div>
            </div>

            {/* 3 Pill Network Cards & Payout Button */}
            <div className="mt-3 grid grid-cols-3 gap-1.5 items-center">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-2 text-center">
                <span className="text-[10px] text-gray-400 font-mono block">•••• 50312</span>
                <span className="text-[11px] font-bold text-gray-700">Somnia</span>
              </div>
              <div className="bg-primary text-white rounded-xl p-2 text-center shadow-sm">
                <span className="text-[10px] text-indigo-200 font-mono block">•••• 6789</span>
                <span className="text-[11px] font-bold text-white">DreamDEX</span>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-2 text-center">
                <span className="text-[10px] text-gray-400 font-mono block">•••• 1234</span>
                <span className="text-[11px] font-bold text-gray-700">tUSDC</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. ACTIVE FILTERS PILL BAR                                               */}
        {/* ========================================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-[#131622] text-white px-3.5 py-2 rounded-full font-semibold flex items-center space-x-1.5 shadow-sm">
              <span>Active filters</span>
              <span className="w-4 h-4 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px]">
                2
              </span>
            </div>

            <button className="bg-white border border-gray-200 hover:bg-gray-50 px-3.5 py-2 rounded-full text-gray-700 flex items-center space-x-1.5 transition-all">
              <span>All AI agents</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            <button className="bg-white border border-gray-200 hover:bg-gray-50 px-3.5 py-2 rounded-full text-gray-700 flex items-center space-x-1.5 transition-all">
              <span>All directions (UP / DOWN)</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            <div className="hidden md:flex items-center space-x-2 text-gray-600 bg-white border border-gray-200 px-3.5 py-2 rounded-full">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>15m Fixed Windows</span>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative min-w-[240px]">
            <input
              type="text"
              placeholder="Search call ID or tx hash..."
              className="w-full bg-white border border-gray-200 rounded-full pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-primary transition-all text-gray-800 placeholder-gray-400"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-2.5" />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. DOMINANT DARK CONSOLE (Master-Detail matching Finnova bottom half)     */}
        {/* ========================================================================= */}
        <div className="finnova-console p-5 sm:p-7 flex flex-col space-y-5">
          {/* Top Sculpted Console Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-navy-border">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base text-white">Live Event Calls</span>
              <span className="text-xs text-gray-400 font-mono font-medium">· DreamDEX CLOB</span>
            </div>

            {/* Center Tab Pills */}
            <div className="flex items-center space-x-1 bg-navy-surface p-1 rounded-full border border-navy-border text-xs">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-3.5 py-1 rounded-full transition-all ${
                  filterStatus === "all" ? "bg-white text-navy font-bold shadow-sm" : "text-gray-400 hover:text-white"
                }`}
              >
                All calls ({activeCalls.length + recentSettlements.length})
              </button>
              <button
                onClick={() => setFilterStatus("draft")}
                className={`px-3.5 py-1 rounded-full transition-all ${
                  filterStatus === "draft" ? "bg-white text-navy font-bold shadow-sm" : "text-gray-400 hover:text-white"
                }`}
              >
                Settled ({recentSettlements.length})
              </button>
              <button
                onClick={() => setFilterStatus("active")}
                className={`px-3.5 py-1 rounded-full transition-all ${
                  filterStatus === "active" ? "bg-primary text-white font-bold shadow-sm" : "text-gray-400 hover:text-white"
                }`}
              >
                In-flight ({activeCalls.length})
              </button>
            </div>

            {/* Right Quick Controls */}
            <div className="flex items-center space-x-2 text-gray-400">
              <button
                onClick={() => setActiveTab(activeTab === "chart" ? "calls" : "chart")}
                className="p-1.5 rounded-lg bg-navy-surface hover:bg-navy-card border border-navy-border transition-colors text-gray-300"
                title="Toggle Chart"
              >
                <BarChart3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab(activeTab === "leaderboard" ? "calls" : "leaderboard")}
                className="p-1.5 rounded-lg bg-navy-surface hover:bg-navy-card border border-navy-border transition-colors text-gray-300"
                title="Toggle Leaderboard"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Conditional Views: Chart or Leaderboard or Master-Detail Split */}
          {activeTab === "chart" ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              <PriceChart asset={selectedAsset} currentPrice={currentPrice} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <OrderBookDepth data={orderBook} marketSymbol={`${selectedAsset}-15M`} />
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
              </div>
            </div>
          ) : activeTab === "leaderboard" ? (
            <div className="animate-in fade-in duration-200">
              <Leaderboard rankings={rankings} />
            </div>
          ) : (
            /* Master-Detail Split Grid (Exact layout from the reference image) */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* LEFT PANE: Selectable Call List (5 cols) */}
              <div className="lg:col-span-5 space-y-2">
                {activeCalls.map((call, idx) => {
                  const isSelected = call.id === selectedCallId;
                  const isUp = call.direction === "up";

                  return (
                    <motion.div
                      key={call.id}
                      onClick={() => setSelectedCallId(call.id)}
                      whileHover={{ scale: 1.01 }}
                      className={`p-3.5 rounded-2xl cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-[#383BA8] text-white shadow-lg border border-indigo-400/40"
                          : "bg-navy-surface/80 hover:bg-navy-surface border border-navy-border text-gray-300"
                      }`}
                    >
                      {/* Avatar & Call ID */}
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                            isSelected ? "bg-white/20 text-white" : "bg-navy-card text-gray-300"
                          }`}
                        >
                          {call.asset}
                        </div>
                        <div>
                          <div className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                            # CALL-{1001 + idx}
                          </div>
                          <div className={`text-xs ${isSelected ? "text-indigo-200" : "text-gray-400"}`}>
                            {call.agentName}
                          </div>
                        </div>
                      </div>

                      {/* Direction / Status Pill */}
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold uppercase ${
                            isSelected
                              ? "bg-white text-[#383BA8]"
                              : isUp
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {call.direction}
                        </span>

                        {/* Amount */}
                        <div className="text-right font-mono font-bold text-sm text-white tabular-nums">
                          ${(call.positionSize * 190).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* RIGHT PANE: Master Featured Card (7 cols - Exact Finnova vibrant purple card) */}
              <div className="lg:col-span-7">
                {activeCall && (
                  <div className="finnova-detail-card p-6 sm:p-7 flex flex-col space-y-6 shadow-xl relative overflow-hidden">
                    {/* Top Row: Call details, Company/Strategy, Customer/Target */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-white/10">
                      <div>
                        <span className="text-xs text-indigo-200 uppercase tracking-wider block font-medium">
                          Call details
                        </span>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                            # CALL-{1001 + activeCalls.indexOf(activeCall)}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/15 text-white border border-white/20 font-mono uppercase">
                            {activeCall.direction}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-xs text-indigo-200 uppercase tracking-wider block font-medium">
                          Deterministic Agent
                        </span>
                        <div className="text-base sm:text-lg font-bold text-white mt-1">
                          {activeCall.agentName}
                        </div>
                      </div>

                      <div>
                        <span className="text-xs text-indigo-200 uppercase tracking-wider block font-medium">
                          Target Asset
                        </span>
                        <div className="text-base sm:text-lg font-bold text-white mt-1 flex items-center gap-1.5">
                          <span>{activeCall.asset}/USD 15m</span>
                        </div>
                      </div>
                    </div>

                    {/* Stated Thesis Quote */}
                    <div className="bg-white/10 p-3 rounded-xl border border-white/15 text-xs text-indigo-100 font-sans leading-relaxed">
                      <span className="font-bold text-white block mb-0.5">Deterministic Pre-Settlement Stated Reasoning:</span>
                      {activeCall.reasoning}
                    </div>

                    {/* 3 Frosted Metric Cards + Add Challenge Box */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="finnova-frosted-stat p-3.5 flex flex-col justify-between">
                        <span className="text-xs text-indigo-200">Entry Probability</span>
                        <div className="text-lg font-bold text-white font-mono mt-2 tabular-nums">
                          {(activeCall.entryPrice * 100).toFixed(1)}% ↗
                        </div>
                        <span className="text-[10px] text-indigo-200 font-mono mt-1">CLOB Price</span>
                      </div>

                      <div className="finnova-frosted-stat p-3.5 flex flex-col justify-between">
                        <span className="text-xs text-indigo-200">Contracts Size</span>
                        <div className="text-lg font-bold text-white font-mono mt-2 tabular-nums">
                          {activeCall.positionSize} ↗
                        </div>
                        <span className="text-[10px] text-indigo-200 font-mono mt-1">Lot units</span>
                      </div>

                      <div className="finnova-frosted-stat p-3.5 flex flex-col justify-between">
                        <span className="text-xs text-indigo-200">Settlement Target</span>
                        <div className="text-lg font-bold text-white font-mono mt-2 tabular-nums">
                          1.85x ↗
                        </div>
                        <span className="text-[10px] text-indigo-200 font-mono mt-1">Fixed window</span>
                      </div>

                      {/* Add Challenge dashed box matching Finnova */}
                      <button
                        onClick={() => addHumanChallenge(activeCall.id, "0x71C...B9a4")}
                        className="border-2 border-dashed border-white/30 hover:border-white/60 bg-white/5 hover:bg-white/10 rounded-xl p-3 flex flex-col items-center justify-center text-white transition-all text-center"
                      >
                        <Plus className="w-5 h-5 mb-1 text-white" />
                        <span className="text-xs font-bold">Challenge</span>
                        <span className="text-[9px] text-indigo-200">Take other side</span>
                      </button>
                    </div>

                    {/* Bottom Summary Bar with Payout Button */}
                    <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center space-x-6">
                        <div>
                          <span className="text-[10px] text-indigo-200 uppercase block font-mono">Sub Total</span>
                          <span className="font-bold text-sm text-white font-mono tabular-nums">
                            ${(activeCall.positionSize * 190).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-indigo-200 uppercase block font-mono">Total Target</span>
                          <span className="font-bold text-sm text-white font-mono tabular-nums">
                            ${(activeCall.positionSize * 190 * 1.85).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-indigo-200 uppercase block font-mono">Oracle Resolution</span>
                          <span className="font-bold text-sm text-white font-mono">
                            Somnia Reactivity
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedProofCall(activeCall)}
                          className="p-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white transition-all border border-white/20"
                          title="Audit Proof Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => addHumanChallenge(activeCall.id, "0x71C...B9a4")}
                          className="px-6 py-2.5 rounded-full bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs sm:text-sm shadow-md transition-all"
                        >
                          Take the other side ({activeCall.direction === "up" ? "DOWN" : "UP"})
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Proof Modal / Audit Panel */}
      <ProofPanel call={selectedProofCall} onClose={() => setSelectedProofCall(null)} />
    </div>
  );
}
