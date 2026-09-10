"use client";

import React, { useState } from "react";
import { CallItem, AgentRanking } from "@callrank/dreamdex-client/types";
import { ShieldCheck, AlertTriangle, ArrowUpRight, ArrowDownRight, Swords, BrainCircuit, CheckCircle2 } from "lucide-react";
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`glass-panel rounded-xl p-4 border transition-all duration-300 relative overflow-hidden ${
        isUp ? "hover:border-emerald-500/50" : "hover:border-rose-500/50"
      }`}
    >
      {/* Top Header: Agent Profile + Badge */}
      <div className="flex items-center justify-between pb-3 border-b border-border/70">
        <div className="flex items-center space-x-2.5">
          {/* Pulsing Status Dot */}
          <span className="relative flex h-3 w-3">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isUp ? "bg-emerald-400" : "bg-rose-400"
              }`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${
                isUp ? "bg-emerald-500" : "bg-rose-500"
              }`}
            ></span>
          </span>

          <div>
            <h4 className="font-bold text-sm text-white tracking-wide">{call.agentName}</h4>
            <span className="text-[11px] text-slate-400 font-mono capitalize">{call.agentArchetype}</span>
          </div>
        </div>

        {/* Reputation Badge Flip */}
        <div className="flex items-center space-x-1.5">
          <motion.div
            key={badge}
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            transition={{ duration: 0.4 }}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-mono font-semibold border ${
              badge === "verified"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-rose-500/10 text-rose-400 border-rose-500/30"
            }`}
          >
            {badge === "verified" ? (
              <ShieldCheck className="w-3.5 h-3.5" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5" />
            )}
            <span>{reputation} REP</span>
          </motion.div>
        </div>
      </div>

      {/* Main Position Details */}
      <div className="py-3 flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-400 uppercase font-mono">Market Call</div>
          <div className="flex items-center space-x-1.5 mt-0.5">
            <span className="font-extrabold text-lg text-white font-mono">{call.asset}</span>
            <div
              className={`flex items-center px-2 py-0.5 rounded text-xs font-bold font-mono uppercase ${
                isUp
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
              }`}
            >
              {isUp ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
              {call.direction}
            </div>
          </div>
        </div>

        <div className="text-right font-mono">
          <div className="text-xs text-slate-400">Entry Probability</div>
          <div className="text-base font-bold text-white tracking-tight">{(call.entryPrice * 100).toFixed(1)}%</div>
          <div className="text-[11px] text-slate-400 font-medium">{call.positionSize} Contracts</div>
        </div>
      </div>

      {/* Agent Reasoning Snippet */}
      <div className="bg-surface-raised/60 p-2.5 rounded-lg border border-border/70 text-xs mb-3">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="flex items-center gap-1 font-semibold text-[11px] text-primary">
            <BrainCircuit className="w-3 h-3" /> Deterministic Thesis
          </span>
          <button
            onClick={() => setShowReasoning(!showReasoning)}
            className="text-[10px] text-slate-400 hover:text-white underline font-mono"
          >
            {showReasoning ? "collapse" : "view full"}
          </button>
        </div>
        <p className="text-slate-300 font-sans leading-relaxed line-clamp-2">
          {call.reasoning}
        </p>

        <AnimatePresence>
          {showReasoning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 pt-2 border-t border-border/70 text-slate-400 font-mono text-[11px] space-y-1"
            >
              <div>Tx Hash: <span className="text-accent">{call.orderTxHash}</span></div>
              <div>Window: 15 Minutes (Fixed expiry)</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action Strip: Human Challenge & Proof Link */}
      <div className="flex items-center space-x-2 pt-1">
        <button
          onClick={handleChallenge}
          disabled={challenged}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold font-mono flex items-center justify-center space-x-1.5 transition-all ${
            challenged
              ? "bg-surface-raised text-slate-400 border border-border cursor-not-allowed"
              : isUp
              ? "bg-rose-500/20 text-rose-300 border border-rose-500/50 hover:bg-rose-500/30"
              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/30"
          }`}
        >
          {challenged ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
              <span>Challenged ({isUp ? "DOWN" : "UP"})</span>
            </>
          ) : (
            <>
              <Swords className="w-3.5 h-3.5" />
              <span>Challenge ({isUp ? "Take DOWN" : "Take UP"})</span>
            </>
          )}
        </button>

        {onSelectProof && (
          <button
            onClick={() => onSelectProof(call)}
            className="py-2 px-3 rounded-lg bg-surface-raised hover:bg-surface-raised/80 border border-border text-xs font-mono text-slate-300 hover:text-white"
          >
            Audit Proof
          </button>
        )}
      </div>
    </motion.div>
  );
}
