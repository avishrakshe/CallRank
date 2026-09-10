"use client";

import React, { useState, useEffect } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useBalance,
  useSwitchChain,
} from "wagmi";
import { somniaShannon } from "@/lib/wagmi";
import { Wallet, AlertTriangle, LogOut, CheckCircle2 } from "lucide-react";

export function ConnectWallet() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { data: balance } = useBalance({
    address,
    chainId: somniaShannon.id,
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="px-3.5 py-1.5 rounded-[2px] text-xs font-mono font-semibold bg-surface-raised border border-border text-text-muted">
        Connect wallet
      </button>
    );
  }

  // State 1: Not connected
  if (!isConnected) {
    return (
      <button
        onClick={() => {
          const connector = connectors[0];
          if (connector) connect({ connector });
        }}
        disabled={isPending}
        className="px-3.5 py-1.5 rounded-[2px] text-xs font-mono font-semibold bg-accent hover:bg-accent-hover text-bg shadow-sm transition-all flex items-center space-x-1.5 disabled:opacity-50"
      >
        <Wallet className="w-3.5 h-3.5" />
        <span>{isPending ? "Connecting…" : "Connect wallet"}</span>
      </button>
    );
  }

  // State 2: Connected, wrong network -> prompt to switch to Somnia Shannon
  if (chainId !== somniaShannon.id) {
    return (
      <button
        onClick={() => switchChain({ chainId: somniaShannon.id })}
        disabled={isSwitching}
        className="px-3 py-1.5 rounded-[2px] text-xs font-mono font-semibold bg-down/20 border border-down text-down hover:bg-down/30 transition-colors flex items-center space-x-1.5"
      >
        <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
        <span>{isSwitching ? "Switching…" : "Switch to Somnia Shannon"}</span>
      </button>
    );
  }

  // State 3: Connected, correct network -> truncated address, live STT balance, disconnect option
  const formattedBalance = balance
    ? `${Number(balance.formatted).toFixed(2)} STT`
    : "0.00 STT";
  const truncatedAddress = address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : "";

  return (
    <div className="flex items-center space-x-2">
      <div className="px-3 py-1.5 rounded-[2px] bg-surface-raised border border-border flex items-center space-x-2 text-xs font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-up animate-pulse" />
        <span className="text-text font-bold tabular-nums">{formattedBalance}</span>
        <span className="text-border">|</span>
        <span className="text-text-muted">{truncatedAddress}</span>
      </div>

      <button
        onClick={() => disconnect()}
        title="Disconnect wallet"
        className="p-1.5 rounded-[2px] bg-surface-raised hover:bg-surface border border-border text-text-muted hover:text-down transition-colors"
      >
        <LogOut className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
