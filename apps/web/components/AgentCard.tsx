"use client";

import React, { useState } from "react";
import { CallItem, AgentRanking } from "@callrank/dreamdex-client/types";
import { motion, AnimatePresence } from "framer-motion";

interface AgentCardProps {
  call: CallItem;
  ranking?: AgentRanking;
  onChallenge?: (callId: string, address: string) => void;
  onSelectProof?: (call: CallItem) => void;
}

export function AgentCard({ call, ranking, onChallenge, onSelectProof }: AgentCardProps) {
  const [showReasoning, setShowReasoning] = useState(false);
  const [challenged, setChallenged] = useState(!!call.userAddress);

  const isUp = call.direction === "up";
  const badge = ranking?.badge || "verified";
  const reputation = ranking?.reputation || 1000;

  const handleChallenge = () => {
    if (challenged) return;
    setChallenged(true);
    onChallenge?.(call.id, "0x71C...B9a4");
  };

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      className="terminal-panel p-3.5 transition-all duration-200"
    >
      {/* Top Header: Agent Profile + Pulse Indicator + Reputation Badge */}
      <div className="flex items-center justify-between pb-2.5 border-b border-border">
        <div className="flex items-center space-x-2">
          {/* Agent Pulse Indicator: pulses while position is open */}
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isUp ? "bg-up" : "bg-down"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isUp ? "bg-up" : "bg-down"
              }`}
            />
          </span>

          <div>
            <h4 className="font-semibold text-xs text-text">{call.agentName}</h4>
            <span className="text-[11px] text-text-muted capitalize">{call.agentArchetype}</span>
          </div>
        </div>

        {/* Reputation Badge: Amber accent spent here */}
        <motion.div
          key={badge}
          initial={{ rotateY: 90 }}
          animate={{ rotateY: 0 }}
          transition={{ duration: 0.3 }}
          className={`flex items-center space-x-1 px-1.5 py-0.5 rounded-[2px] text-[11px] font-mono border ${
            badge === "verified"
              ? "bg-accent/10 text-accent border-accent/30"
              : "bg-surface-raised text-text-muted border-border"
          }`}
        >
          <span>{badge}</span>
          <span className="text-text-muted">({reputation})</span>
        </motion.div>
      </div>

      {/* Main Position Details */}
      <div className="py-2.5 flex items-center justify-between">
        <div>
          <div className="text-[11px] text-text-muted">Market call</div>
          <div className="flex items-center space-x-2 mt-0.5">
            <span className="font-bold text-sm text-text font-mono">{call.asset}</span>
            <span
              className={`px-1.5 py-0.5 rounded-[2px] text-xs font-mono font-semibold uppercase ${
                isUp
                  ? "bg-up/10 text-up border border-up/30"
                  : "bg-down/10 text-down border border-down/30"
              }`}
            >
              {call.direction}
            </span>
          </div>
        </div>

        <div className="text-right font-mono tabular-nums">
          <div className="text-[11px] text-text-muted">Entry probability</div>
          <div className="text-sm font-bold text-text">{(call.entryPrice * 100).toFixed(1)}%</div>
          <div className="text-[10px] text-text-muted">{call.positionSize} contracts</div>
        </div>
      </div>

      {/* Agent Stated Reasoning */}
      <div className="bg-surface-raised p-2 rounded-[2px] border border-border text-xs mb-2.5">
        <div className="flex items-center justify-between text-text-muted mb-1 text-[11px]">
          <span>Stated thesis</span>
          <button
            onClick={() => setShowReasoning(!showReasoning)}
            className="text-[10px] text-text-muted hover:text-text underline font-mono"
          >
            {showReasoning ? "collapse" : "view full"}
          </button>
        </div>
        <p className="text-text leading-relaxed text-xs line-clamp-2">
          {call.reasoning}
        </p>

        <AnimatePresence>
          {showReasoning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 pt-2 border-t border-border text-text-muted font-mono text-[11px] space-y-1"
            >
              <div>Order tx: <span className="text-text">{call.orderTxHash}</span></div>
              <div>Window: 15 minutes</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Strip: Functional Microcopy ("Take the other side", "Audit proof") */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handleChallenge}
          disabled={challenged}
          className={`flex-1 py-1.5 px-2.5 rounded-[2px] text-xs font-mono font-medium transition-all ${
            challenged
              ? "bg-surface-raised text-text-muted border border-border cursor-not-allowed"
              : isUp
              ? "bg-down/10 text-down border border-down/40 hover:bg-down/20"
              : "bg-up/10 text-up border border-up/40 hover:bg-up/20"
          }`}
        >
          {challenged
            ? `Taking other side (${isUp ? "down" : "up"})`
            : `Take the other side (${isUp ? "down" : "up"})`}
        </button>

        {onSelectProof && (
          <button
            onClick={() => onSelectProof(call)}
            className="py-1.5 px-2.5 rounded-[2px] bg-surface-raised hover:bg-surface border border-border text-xs font-mono text-text-muted hover:text-text transition-colors"
          >
            Audit proof
          </button>
        )}
      </div>
    </motion.div>
  );
}
