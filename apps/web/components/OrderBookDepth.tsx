"use client";

import React from "react";
import { OrderBookDepthData } from "@/hooks/useLiveFeed";
import { Layers } from "lucide-react";

interface OrderBookDepthProps {
  data: OrderBookDepthData;
  marketSymbol?: string;
}

export function OrderBookDepth({ data, marketSymbol = "BTC-15M" }: OrderBookDepthProps) {
  const { bids, asks } = data;

  const maxBidSize = Math.max(...bids.map((b) => b[1]), 1000);
  const maxAskSize = Math.max(...asks.map((a) => a[1]), 1000);
  const maxSize = Math.max(maxBidSize, maxAskSize);

  return (
    <div className="glass-panel rounded-xl p-4 border border-border flex flex-col h-full">
      <div className="flex items-center justify-between pb-2 border-b border-border/70 mb-3">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-primary" />
          <span className="font-bold text-sm text-white uppercase tracking-wider">Order Book Depth</span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-surface-raised px-2 py-0.5 rounded border border-border">
          {marketSymbol} CLOB
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-1 text-slate-400 px-1 font-semibold">
        <div className="flex justify-between">
          <span>UP BID (P)</span>
          <span>SIZE</span>
        </div>
        <div className="flex justify-between">
          <span>SIZE</span>
          <span className="text-right">DOWN ASK (1-P)</span>
        </div>
      </div>

      {/* Mirrored Depth Visualizer */}
      <div className="space-y-1.5 flex-1 flex flex-col justify-center">
        {Array.from({ length: 5 }).map((_, idx) => {
          const bid = bids[idx] || [0.5, 0];
          const ask = asks[idx] || [0.5, 0];

          const bidWidthPct = Math.min(100, Math.round((bid[1] / maxSize) * 100));
          const askWidthPct = Math.min(100, Math.round((ask[1] / maxSize) * 100));

          return (
            <div key={idx} className="grid grid-cols-2 gap-2 text-xs font-mono">
              {/* Bid Row (Up side) */}
              <div className="relative flex items-center justify-between px-2 py-1 rounded bg-surface-raised/40 overflow-hidden">
                <div
                  className="absolute right-0 top-0 bottom-0 bg-emerald-500/15 border-r-2 border-emerald-400 transition-all duration-300"
                  style={{ width: `${bidWidthPct}%` }}
                />
                <span className="relative z-10 font-bold text-emerald-400">{bid[0].toFixed(3)}</span>
                <span className="relative z-10 text-slate-300">{bid[1].toLocaleString()}</span>
              </div>

              {/* Ask Row (Down side) */}
              <div className="relative flex items-center justify-between px-2 py-1 rounded bg-surface-raised/40 overflow-hidden">
                <div
                  className="absolute left-0 top-0 bottom-0 bg-rose-500/15 border-l-2 border-rose-400 transition-all duration-300"
                  style={{ width: `${askWidthPct}%` }}
                />
                <span className="relative z-10 text-slate-300">{ask[1].toLocaleString()}</span>
                <span className="relative z-10 font-bold text-rose-400">{(1 - ask[0]).toFixed(3)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* CLOB Stats Footer */}
      <div className="pt-3 mt-2 border-t border-border/70 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>Spread: {((asks[0]?.[0] || 0.52) - (bids[0]?.[0] || 0.5)).toFixed(3)}</span>
        <span className="text-primary">Mint-a-Pair: Active</span>
      </div>
    </div>
  );
}
