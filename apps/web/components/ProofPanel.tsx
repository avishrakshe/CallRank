"use client";

import React from "react";
import { CallItem } from "@callrank/dreamdex-client/types";
import { ExternalLink, X } from "lucide-react";

interface ProofPanelProps {
  call: CallItem | null;
  onClose: () => void;
}

export function ProofPanel({ call, onClose }: ProofPanelProps) {
  if (!call) return null;

  const isWon = call.resolution === "won";
  const isSettled = !!call.resolution;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="terminal-panel w-full max-w-xl p-6 relative shadow-2xl text-text border border-border-active">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-[2px] bg-surface-raised hover:bg-surface text-text-muted hover:text-text transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="pb-3 border-b border-border mb-4">
          <h3 className="font-semibold text-base text-text">Verifiable settlement proof</h3>
          <p className="text-xs text-text-muted font-mono">Somnia Shannon testnet · DreamDEX event contract</p>
        </div>

        {/* Resolution Banner */}
        <div
          className={`p-3 rounded-[2px] border flex items-center justify-between mb-4 font-mono ${
            isSettled
              ? isWon
                ? "bg-up/10 border-up/30 text-up"
                : "bg-down/10 border-down/30 text-down"
              : "bg-surface-raised border-border text-text"
          }`}
        >
          <div className="flex items-center space-x-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isSettled ? (isWon ? "bg-up" : "bg-down") : "bg-accent animate-pulse"
              }`}
            />
            <span className="font-semibold text-xs uppercase">
              {isSettled ? `Outcome: Call ${call.resolution}` : "In-flight position"}
            </span>
          </div>
          {call.payout !== undefined && call.payout !== null && (
            <span className="font-mono font-bold text-xs tabular-nums">
              Payout: {call.payout.toFixed(2)} USDso
            </span>
          )}
        </div>

        {/* Audit Data Grid */}
        <div className="space-y-2 text-xs font-mono">
          <div className="grid grid-cols-2 gap-2 bg-surface-raised p-2.5 rounded-[2px] border border-border">
            <div>
              <span className="text-text-muted block text-[11px]">Agent</span>
              <span className="font-semibold text-text">{call.agentName}</span>
            </div>
            <div>
              <span className="text-text-muted block text-[11px]">Direction and asset</span>
              <span className="font-semibold text-text uppercase">
                {call.direction} · {call.asset}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-surface-raised p-2.5 rounded-[2px] border border-border tabular-nums">
            <div>
              <span className="text-text-muted block text-[11px]">Entry probability</span>
              <span className="font-semibold text-text">{(call.entryPrice * 100).toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-text-muted block text-[11px]">Position size</span>
              <span className="font-semibold text-text">{call.positionSize} contracts</span>
            </div>
          </div>

          {/* Transaction Hashes */}
          <div className="bg-surface-raised p-2.5 rounded-[2px] border border-border space-y-2">
            <div>
              <div className="flex items-center justify-between text-text-muted mb-1 text-[11px]">
                <span>Order placement tx hash</span>
                <a
                  href={`https://shannon-explorer.somnia.network/tx/${call.orderTxHash || ""}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent hover:underline flex items-center gap-1"
                >
                  Explorer <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="text-text font-mono text-[11px] truncate bg-surface p-1.5 rounded-[2px]">
                {call.orderTxHash || "0x39a1c8...f9024"}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-text-muted mb-1 text-[11px]">
                <span>Settlement tx hash</span>
                <a
                  href={`https://shannon-explorer.somnia.network/tx/${call.settlementTxHash || ""}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent hover:underline flex items-center gap-1"
                >
                  Explorer <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="text-text font-mono text-[11px] truncate bg-surface p-1.5 rounded-[2px]">
                {call.settlementTxHash || "0x892be1...b6a71"}
              </div>
            </div>
          </div>

          {/* Stated Deterministic Reasoning */}
          <div className="bg-surface-raised p-2.5 rounded-[2px] border border-border">
            <span className="text-text-muted block text-[11px] mb-1">
              Deterministic pre-settlement reasoning
            </span>
            <p className="text-text font-sans leading-relaxed text-xs">{call.reasoning}</p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
          <a
            href="https://docs.dreamdex.io/developers/event-contracts"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-text-muted hover:text-text flex items-center gap-1 font-mono"
          >
            DreamDEX protocol docs <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-[2px] bg-accent hover:bg-accent-hover font-mono text-xs font-semibold text-bg transition-colors"
          >
            Close audit
          </button>
        </div>
      </div>
    </div>
  );
}
