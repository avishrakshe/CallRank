"use client";

import React from "react";
import Link from "next/link";
import { useLiveFeed } from "@/hooks/useLiveFeed";
import { CountdownRing } from "./CountdownRing";
import { ArrowUpRight, ArrowDownRight, Zap, ExternalLink } from "lucide-react";

export function LiveMiniTerminal() {
  const { btcPrice, ethPrice, activeCalls, activities } = useLiveFeed("BTC");

  const now = Date.now();
  const next15mExpiry = now + (900000 - (now % 900000));
  const latestCall = activeCalls[0];
  const isUp = latestCall?.direction === "up";

  return (
    <div className="terminal-panel p-5 flex flex-col space-y-4 border border-border hover:border-border-active transition-all shadow-xl bg-surface/90">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-border text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-up animate-pulse" />
          <span className="font-semibold text-text">Live stream</span>
          <span className="text-[11px] font-mono text-text-muted">Somnia 50312</span>
        </div>
        <Link
          href="/markets"
          className="text-accent hover:underline text-xs font-mono font-medium flex items-center gap-1"
        >
          Full terminal <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Hero prices & countdown */}
      <div className="grid grid-cols-12 gap-3 items-center">
        {/* Left: Prices */}
        <div className="col-span-7 space-y-3">
          <div className="p-2.5 rounded-[2px] bg-surface-raised border border-border">
            <div className="flex items-center justify-between text-xs font-mono text-text-muted mb-0.5">
              <span>BTC/USD</span>
              <span className="text-up font-semibold">+1.42%</span>
            </div>
            <div className="text-xl font-bold font-mono text-text tabular-nums">
              ${btcPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="p-2.5 rounded-[2px] bg-surface-raised border border-border">
            <div className="flex items-center justify-between text-xs font-mono text-text-muted mb-0.5">
              <span>ETH/USD</span>
              <span className="text-up font-semibold">+0.85%</span>
            </div>
            <div className="text-lg font-bold font-mono text-text tabular-nums">
              ${ethPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Right: Countdown */}
        <div className="col-span-5 flex justify-center">
          <CountdownRing
            targetTimestamp={next15mExpiry}
            totalDurationSeconds={900}
            label="15m expiry"
            size={88}
          />
        </div>
      </div>

      {/* In-flight Call Teaser */}
      {latestCall && (
        <div className="bg-surface-raised p-3 rounded-[2px] border border-border space-y-1.5 text-xs font-mono">
          <div className="flex items-center justify-between">
            <span className="text-text-muted">Active agent call</span>
            <span
              className={`px-1.5 py-0.2 rounded-[2px] text-[10px] font-semibold uppercase ${
                isUp ? "bg-up/15 text-up border border-up/30" : "bg-down/15 text-down border border-down/30"
              }`}
            >
              {latestCall.asset} {latestCall.direction}
            </span>
          </div>
          <div className="font-semibold text-text">{latestCall.agentName}</div>
          <p className="text-[11px] text-text-muted font-sans line-clamp-1">
            {latestCall.reasoning}
          </p>
        </div>
      )}

      {/* Activity tick snippet */}
      <div className="text-[11px] font-mono text-text-muted truncate pt-1 border-t border-border flex items-center gap-1.5">
        <Zap className="w-3 h-3 text-accent shrink-0" />
        <span className="truncate">{activities[0]?.message || "Observing live market orderbook on Somnia"}</span>
      </div>
    </div>
  );
}
