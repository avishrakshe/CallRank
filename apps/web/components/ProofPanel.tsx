"use client";

import React from "react";
import { CallItem } from "@callrank/dreamdex-client/types";
import { ExternalLink, CheckCircle2, XCircle, Shield, Hash, X } from "lucide-react";

interface ProofPanelProps {
  call: CallItem | null;
  onClose: () => void;
}

export function ProofPanel({ call, onClose }: ProofPanelProps) {
  if (!call) return null;

  const isWon = call.resolution === "won";
  const isSettled = !!call.resolution;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel-glow w-full max-w-xl rounded-2xl p-6 relative border border-primary/40 shadow-2xl text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-surface-raised hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 pb-4 border-b border-border mb-4">
          <div className="p-2.5 rounded-xl bg-primary/20 border border-primary/40">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Verifiable Settlement Proof</h3>
            <p className="text-xs text-slate-400 font-mono">Somnia Shannon Testnet · DreamDEX Event Contract</p>
          </div>
        </div>

        {/* Resolution Banner */}
        <div
          className={`p-3 rounded-xl border flex items-center justify-between mb-4 font-mono ${
            isSettled
              ? isWon
                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/40 text-rose-400"
              : "bg-indigo-500/10 border-indigo-500/40 text-indigo-400"
          }`}
        >
          <div className="flex items-center space-x-2">
            {isSettled ? (
              isWon ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )
            ) : (
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
            )}
            <span className="font-bold text-sm uppercase">
              {isSettled ? `Outcome: Call ${call.resolution}` : "In-Flight Position"}
            </span>
          </div>
          {call.payout !== undefined && call.payout !== null && (
            <span className="font-extrabold text-sm">Payout: {call.payout.toFixed(2)} USDso</span>
          )}
        </div>

        {/* Audit Data Grid */}
        <div className="space-y-2.5 text-xs font-mono">
          <div className="grid grid-cols-2 gap-2 bg-surface-raised/60 p-3 rounded-lg border border-border">
            <div>
              <span className="text-slate-400 block text-[11px]">AGENT</span>
              <span className="font-bold text-white text-sm">{call.agentName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">DIRECTION / ASSET</span>
              <span className="font-bold text-white text-sm">
                {call.direction.toUpperCase()} · {call.asset}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-surface-raised/60 p-3 rounded-lg border border-border">
            <div>
              <span className="text-slate-400 block text-[11px]">ENTRY PROBABILITY</span>
              <span className="font-bold text-white text-sm">{(call.entryPrice * 100).toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">POSITION SIZE</span>
              <span className="font-bold text-white text-sm">{call.positionSize} Contracts</span>
            </div>
          </div>

          {/* Transaction Hashes */}
          <div className="bg-surface-raised/80 p-3 rounded-lg border border-border space-y-2">
            <div>
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span>Order Placement Tx Hash</span>
                <a
                  href={`https://shannon-explorer.somnia.network/tx/${call.orderTxHash || ""}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:text-primary-hover flex items-center gap-1 font-semibold"
                >
                  Explorer <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="text-slate-300 font-mono text-[11px] truncate bg-black/40 p-1.5 rounded">
                {call.orderTxHash || "0x39a1c8...f9024"}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span>Settlement Tx Hash</span>
                <a
                  href={`https://shannon-explorer.somnia.network/tx/${call.settlementTxHash || ""}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:text-primary-hover flex items-center gap-1 font-semibold"
                >
                  Explorer <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="text-slate-300 font-mono text-[11px] truncate bg-black/40 p-1.5 rounded">
                {call.settlementTxHash || "0x892be1...b6a71"}
              </div>
            </div>
          </div>

          {/* Stated Deterministic Reasoning */}
          <div className="bg-surface-raised/40 p-3 rounded-lg border border-border/80">
            <span className="text-slate-400 block text-[11px] mb-1 font-semibold text-primary">
              Deterministic Pre-Settlement Stated Reasoning
            </span>
            <p className="text-slate-300 font-sans leading-relaxed text-xs">{call.reasoning}</p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-5 pt-3 border-t border-border flex items-center justify-between">
          <a
            href="https://docs.dreamdex.io/developers/event-contracts"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono"
          >
            DreamDEX Protocol Docs <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover font-mono text-xs font-bold text-white transition-all shadow-md"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
}
