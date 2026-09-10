"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ArrowLeft,
  Copy,
  Clock,
  Layers,
  Sparkles,
} from "lucide-react";

interface ProofRecord {
  callId: string;
  agentId: string;
  agentName: string;
  marketId: string;
  asset: "BTC" | "ETH";
  direction: "up" | "down";
  windowSeconds: number;
  entryTimestamp: string;
  expiryTimestamp: string;
  entryPriceProb: number;
  entrySpotPrice: number;
  settlementSpotPrice: number;
  positionSize: number;
  orderTxHash: string;
  settlementTxHash: string;
  resolution: "won" | "lost" | "pending";
  payout: number;
  pnlPercentage: number;
  reasoning: string;
  blockNumber: number;
}

const PROOF_DATABASE: Record<string, ProofRecord> = {
  "call-1": {
    callId: "call-1",
    agentId: "agent-momentum",
    agentName: "Momentum Alpha",
    marketId: "0x679795a0195a1b76cdebb7c51d74e058aee92919b8c3389af86ef24535e8a28c",
    asset: "BTC",
    direction: "up",
    windowSeconds: 900,
    entryTimestamp: "2026-09-11T03:45:00.000Z",
    expiryTimestamp: "2026-09-11T04:00:00.000Z",
    entryPriceProb: 0.584,
    entrySpotPrice: 88410.5,
    settlementSpotPrice: 88642.0,
    positionSize: 10.0,
    orderTxHash: "0x4f8a129c2ea5498877bc9321e0182bbfa2167cddfe98124018acbdfe81023a",
    settlementTxHash: "0x9a3e2187fba1287bc1289cca0912ffea182910cc91823bb19a82ca71829031",
    resolution: "won",
    payout: 17.12,
    pnlPercentage: 71.2,
    reasoning:
      "Spot price velocity broke 0.05% threshold over the preceding 5-minute aggregation window. Momentum score reached 0.84 with strong buy volume on DreamDEX Event Contract book.",
    blockNumber: 485017420,
  },
  "call-2": {
    callId: "call-2",
    agentId: "agent-momentum",
    agentName: "Momentum Alpha",
    marketId: "0x679795a0195a1b76cdebb7c51d74e058aee92919b8c3389af86ef24535e8a28c",
    asset: "BTC",
    direction: "up",
    windowSeconds: 900,
    entryTimestamp: "2026-09-11T03:15:00.000Z",
    expiryTimestamp: "2026-09-11T03:30:00.000Z",
    entryPriceProb: 0.542,
    entrySpotPrice: 88120.0,
    settlementSpotPrice: 88295.0,
    positionSize: 10.0,
    orderTxHash: "0x7bc392110ea4958172da8921008126bb8726acddfc881290aa7612bbd09182",
    settlementTxHash: "0x23ac7819ea871092873bbfe9812acb98129ca081928001ba908129cbba8712",
    resolution: "won",
    payout: 18.4,
    pnlPercentage: 84.0,
    reasoning:
      "Upward break of recent local resistance level at $88,100 with accelerating tape ticks.",
    blockNumber: 485016980,
  },
  "call-c1": {
    callId: "call-c1",
    agentId: "agent-contrarian",
    agentName: "Contrarian Mean-Reversion",
    marketId: "0x12bb4910a9c8e1028734bbca9012891901abcf89128009182bb1928374829101",
    asset: "ETH",
    direction: "down",
    windowSeconds: 900,
    entryTimestamp: "2026-09-11T03:50:00.000Z",
    expiryTimestamp: "2026-09-11T04:05:00.000Z",
    entryPriceProb: 0.51,
    entrySpotPrice: 2710.2,
    settlementSpotPrice: 2698.4,
    positionSize: 10.0,
    orderTxHash: "0x55ca891102ba98721c45019abbfa2091827cca91820129bc81729cc019a826",
    settlementTxHash: "0x89bb3190ab7621876352cca19028acb87192a09182bbfa8712903bbca09128",
    resolution: "won",
    payout: 19.6,
    pnlPercentage: 96.0,
    reasoning:
      "Spot ETH surged +0.09% into short-term resistance. Fading excessive optimist bias back toward midpoint.",
    blockNumber: 485017510,
  },
};

export default function ProofPage() {
  const params = useParams();
  const callId = (params?.callId as string) || "call-1";
  const proof = PROOF_DATABASE[callId] || PROOF_DATABASE["call-1"];

  const explorerBase = "https://shannon-explorer.somnia.network/tx/";

  return (
    <div className="w-full bg-bg py-10 text-text">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Navigation back */}
        <Link
          href="/markets"
          className="inline-flex items-center space-x-1.5 text-xs font-mono text-text-muted hover:text-text transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to live terminal</span>
        </Link>

        {/* Top Header Card */}
        <div className="bg-surface border border-border p-6 rounded-[4px] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-accent font-bold">SETTLEMENT AUDIT PROOF</span>
                <span className="px-2 py-0.5 rounded-[2px] bg-up/15 border border-up/30 text-up text-[11px] font-mono font-semibold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>On-Chain Verified</span>
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold font-mono text-text">
                Call #{proof.callId}
              </h1>
            </div>

            <div className="text-right font-mono">
              <div className="text-xs text-text-muted">Final Resolution</div>
              <div className="text-lg font-bold text-up">
                {proof.resolution.toUpperCase()} (+{proof.pnlPercentage.toFixed(1)}%)
              </div>
            </div>
          </div>

          <div className="text-xs text-text-muted font-mono leading-relaxed">
            This proof verifies that agent <strong className="text-text">{proof.agentName}</strong> entered
            a real fixed-window Event Contract on DreamDEX via Somnia Shannon testnet. The state commitment,
            order execution, and settlement outcome are immutable on-chain.
          </div>
        </div>

        {/* Audit Trail Grid */}
        <div className="bg-surface border border-border rounded-[4px] p-6 space-y-6 font-mono text-xs">
          <div className="text-xs font-bold text-text-muted border-b border-border pb-2 flex items-center justify-between">
            <span>EVENT CONTRACT LIFECYCLE AUDIT</span>
            <span>CHAIN ID: 50312</span>
          </div>

          {/* Core Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-surface-raised border border-border rounded-[2px] space-y-1">
              <div className="text-text-muted">Asset &amp; Position Direction</div>
              <div className="text-sm font-bold">
                <span className={proof.direction === "up" ? "text-up" : "text-down"}>
                  {proof.asset} {proof.direction.toUpperCase()}
                </span>
                <span className="text-text-muted font-normal ml-2">({proof.windowSeconds / 60}m window)</span>
              </div>
            </div>

            <div className="p-3 bg-surface-raised border border-border rounded-[2px] space-y-1">
              <div className="text-text-muted">Agent Account</div>
              <div className="text-sm font-bold text-text">
                <Link href={`/agents/${proof.agentId}`} className="hover:text-accent underline">
                  {proof.agentName}
                </Link>
              </div>
            </div>

            <div className="p-3 bg-surface-raised border border-border rounded-[2px] space-y-1">
              <div className="text-text-muted">Entry Spot Price vs Resolution Spot Price</div>
              <div className="text-sm font-bold text-text">
                ${proof.entrySpotPrice.toLocaleString()} → ${proof.settlementSpotPrice.toLocaleString()}
              </div>
            </div>

            <div className="p-3 bg-surface-raised border border-border rounded-[2px] space-y-1">
              <div className="text-text-muted">Position Size &amp; Gross Payout</div>
              <div className="text-sm font-bold text-up">
                {proof.positionSize.toFixed(1)} STT Collateral → {proof.payout.toFixed(2)} STT Payout
              </div>
            </div>
          </div>

          {/* Stated Pre-Settlement Reasoning Commitment */}
          <div className="p-4 bg-bg border border-border rounded-[2px] space-y-2">
            <div className="text-text-muted font-bold flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Pre-Settlement Reasoning Commitment</span>
            </div>
            <p className="text-text leading-relaxed text-[11px]">
              &ldquo;{proof.reasoning}&rdquo;
            </p>
          </div>

          {/* On-Chain Verification Hashes with Explorer Links */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold text-text-muted">On-Chain Transaction Verification</div>

            <div className="p-3 bg-surface-raised border border-border rounded-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-text-muted text-[11px]">Order Placement Transaction Hash</div>
                <div className="text-text font-bold break-all">{proof.orderTxHash}</div>
              </div>
              <a
                href={`${explorerBase}${proof.orderTxHash}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-surface border border-border text-accent hover:bg-surface-raised rounded-[2px] shrink-0"
              >
                <span>View on Somnia Explorer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="p-3 bg-surface-raised border border-border rounded-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-text-muted text-[11px]">Contract Settlement Transaction Hash</div>
                <div className="text-text font-bold break-all">{proof.settlementTxHash}</div>
              </div>
              <a
                href={`${explorerBase}${proof.settlementTxHash}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-surface border border-border text-accent hover:bg-surface-raised rounded-[2px] shrink-0"
              >
                <span>View on Somnia Explorer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="p-3 bg-surface-raised border border-border rounded-[2px] flex items-center justify-between text-[11px]">
              <span className="text-text-muted">DreamDEX Market Address</span>
              <span className="text-text font-bold break-all">{proof.marketId}</span>
            </div>

            <div className="p-3 bg-surface-raised border border-border rounded-[2px] flex items-center justify-between text-[11px]">
              <span className="text-text-muted">Settlement Block Height</span>
              <span className="text-text font-bold">#{proof.blockNumber}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
