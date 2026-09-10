"use client";

import React from "react";
import { OrderBookDepthData } from "@/hooks/useLiveFeed";

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
    <div className="terminal-panel p-3.5 flex flex-col h-full">
      <div className="flex items-center justify-between pb-2 border-b border-border mb-2.5">
        <span className="font-semibold text-xs text-text">Order book depth</span>
        <span className="text-[10px] font-mono text-text-muted bg-surface-raised px-1.5 py-0.5 rounded-[2px] border border-border">
          {marketSymbol} CLOB
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-text-muted mb-1 px-1">
        <div className="flex justify-between">
          <span>Up bid (p)</span>
          <span>Size</span>
        </div>
        <div className="flex justify-between">
          <span>Size</span>
          <span className="text-right">Down ask (1-p)</span>
        </div>
      </div>

      {/* Mirrored Depth Visualizer */}
      <div className="space-y-1 flex-1 flex flex-col justify-center">
        {Array.from({ length: 5 }).map((_, idx) => {
          const bid = bids[idx] || [0.5, 0];
          const ask = asks[idx] || [0.5, 0];

          const bidWidthPct = Math.min(100, Math.round((bid[1] / maxSize) * 100));
          const askWidthPct = Math.min(100, Math.round((ask[1] / maxSize) * 100));

          return (
            <div key={idx} className="grid grid-cols-2 gap-2 text-xs font-mono tabular-nums">
              {/* Bid Row (Up side) */}
              <div className="relative flex items-center justify-between px-2 py-0.5 rounded-[2px] bg-surface-raised/40 overflow-hidden">
                <div
                  className="absolute right-0 top-0 bottom-0 bg-up/15 border-r-2 border-up transition-all duration-300"
                  style={{ width: `${bidWidthPct}%` }}
                />
                <span className="relative z-10 font-bold text-up">{bid[0].toFixed(3)}</span>
                <span className="relative z-10 text-text">{bid[1].toLocaleString()}</span>
              </div>

              {/* Ask Row (Down side) */}
              <div className="relative flex items-center justify-between px-2 py-0.5 rounded-[2px] bg-surface-raised/40 overflow-hidden">
                <div
                  className="absolute left-0 top-0 bottom-0 bg-down/15 border-l-2 border-down transition-all duration-300"
                  style={{ width: `${askWidthPct}%` }}
                />
                <span className="relative z-10 text-text">{ask[1].toLocaleString()}</span>
                <span className="relative z-10 font-bold text-down">{(1 - ask[0]).toFixed(3)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* CLOB Stats Footer */}
      <div className="pt-2 mt-1.5 border-t border-border flex items-center justify-between text-[11px] text-text-muted font-mono">
        <span>Spread: {((asks[0]?.[0] || 0.52) - (bids[0]?.[0] || 0.5)).toFixed(3)}</span>
        <span className="text-accent">Mint-a-pair active</span>
      </div>
    </div>
  );
}
