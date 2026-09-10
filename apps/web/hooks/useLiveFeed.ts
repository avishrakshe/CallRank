"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { LiveEvent, AssetSymbol, CallItem, AgentRanking, EventContractMarket } from "@callrank/dreamdex-client/types";
import { playWinCue, playLossCue } from "@/lib/audio";

export interface OrderBookDepthData {
  bids: [number, number][]; // [price, size]
  asks: [number, number][];
}

export function useLiveFeed(selectedAsset: AssetSymbol = "BTC") {
  const [btcPrice, setBtcPrice] = useState<number>(88450.0);
  const [ethPrice, setEthPrice] = useState<number>(3120.0);
  const [recentTicks, setRecentTicks] = useState<{ time: number; price: number }[]>([]);
  const [orderBook, setOrderBook] = useState<OrderBookDepthData>({
    bids: [
      [0.53, 1200],
      [0.52, 2400],
      [0.51, 3800],
      [0.50, 5200],
      [0.49, 7100],
    ],
    asks: [
      [0.55, 1100],
      [0.56, 2100],
      [0.57, 3600],
      [0.58, 4900],
      [0.59, 6800],
    ],
  });

  const [activeCalls, setActiveCalls] = useState<CallItem[]>([
    {
      id: "call-1",
      agentId: "agent-momentum",
      agentName: "Momentum Alpha",
      agentArchetype: "momentum",
      marketId: "ec-btc-15m",
      asset: "BTC",
      direction: "up",
      windowSeconds: 900,
      entryTimestamp: Date.now() - 240000,
      entryPrice: 0.54,
      expiryTimestamp: Date.now() + 660000,
      positionSize: 250,
      orderTxHash: "0x789a...4b12",
      reasoning: "Observed +0.48% upward momentum breakout on BTC 15m window.",
    },
    {
      id: "call-2",
      agentId: "agent-contrarian",
      agentName: "Contrarian Mean-Reversion",
      agentArchetype: "contrarian",
      marketId: "ec-eth-15m",
      asset: "ETH",
      direction: "down",
      windowSeconds: 900,
      entryTimestamp: Date.now() - 180000,
      entryPrice: 0.48,
      expiryTimestamp: Date.now() + 720000,
      positionSize: 300,
      orderTxHash: "0x12ef...89c0",
      reasoning: "Fading ETH overextension near local resistance, targeting mean reversion.",
    },
    {
      id: "call-3",
      agentId: "agent-random",
      agentName: "Entropy Baseline",
      agentArchetype: "random-baseline",
      marketId: "ec-btc-15m",
      asset: "BTC",
      direction: "down",
      windowSeconds: 900,
      entryTimestamp: Date.now() - 120000,
      entryPrice: 0.46,
      expiryTimestamp: Date.now() + 780000,
      positionSize: 100,
      orderTxHash: "0x33ca...f011",
      reasoning: "Deterministic pseudo-random control call. Zero edge baseline.",
    },
  ]);

  const [recentSettlements, setRecentSettlements] = useState<CallItem[]>([]);
  const [activities, setActivities] = useState<
    { id: string; message: string; timestamp: number; category: "market" | "agent" | "settlement" }[]
  >([
    {
      id: "act-1",
      message: "Momentum Alpha entered BTC UP · 15m @ 0.54 (250 contracts)",
      timestamp: Date.now() - 240000,
      category: "agent",
    },
    {
      id: "act-2",
      message: "Contrarian Mean-Reversion settled ETH DOWN · WON +4.8% payout",
      timestamp: Date.now() - 180000,
      category: "settlement",
    },
    {
      id: "act-3",
      message: "DreamDEX scheduled new BTC 15-Minute Event Contract window",
      timestamp: Date.now() - 90000,
      category: "market",
    },
  ]);

  const [rankings, setRankings] = useState<AgentRanking[]>([
    {
      agentId: "agent-momentum",
      name: "Momentum Alpha",
      archetype: "momentum",
      reputation: 1140,
      badge: "verified",
      totalCalls: 24,
      wins: 16,
      losses: 8,
      winRate: 0.667,
      cumulativePnl: 58.4,
      sharpeRatio: 1.84,
      activeCalls: 1,
    },
    {
      agentId: "agent-contrarian",
      name: "Contrarian Mean-Reversion",
      archetype: "contrarian",
      reputation: 1080,
      badge: "verified",
      totalCalls: 22,
      wins: 13,
      losses: 9,
      winRate: 0.591,
      cumulativePnl: 34.2,
      sharpeRatio: 1.45,
      activeCalls: 1,
    },
    {
      agentId: "agent-random",
      name: "Entropy Baseline",
      archetype: "random-baseline",
      reputation: 980,
      badge: "verified",
      totalCalls: 20,
      wins: 9,
      losses: 11,
      winRate: 0.45,
      cumulativePnl: -5.6,
      sharpeRatio: -0.12,
      activeCalls: 1,
    },
  ]);

  const [isConnected, setIsConnected] = useState(true);

  // Background smooth live tick generation
  useEffect(() => {
    const tickInterval = setInterval(() => {
      const btcShift = (Math.random() - 0.49) * 12.0;
      const ethShift = (Math.random() - 0.49) * 1.2;

      setBtcPrice((prev) => {
        const next = +(prev + btcShift).toFixed(2);
        if (selectedAsset === "BTC") {
          setRecentTicks((ticks) => [...ticks.slice(-30), { time: Date.now(), price: next }]);
        }
        return next;
      });

      setEthPrice((prev) => {
        const next = +(prev + ethShift).toFixed(2);
        if (selectedAsset === "ETH") {
          setRecentTicks((ticks) => [...ticks.slice(-30), { time: Date.now(), price: next }]);
        }
        return next;
      });

      // Fluctuate order book slightly
      if (Math.random() > 0.4) {
        setOrderBook((prev) => {
          const midProb = 0.53 + (Math.random() - 0.5) * 0.04;
          return {
            bids: [
              [+(midProb - 0.01).toFixed(3), Math.round(1000 + Math.random() * 2000)],
              [+(midProb - 0.02).toFixed(3), Math.round(2000 + Math.random() * 3000)],
              [+(midProb - 0.03).toFixed(3), Math.round(3500 + Math.random() * 4000)],
              [+(midProb - 0.04).toFixed(3), Math.round(5000 + Math.random() * 5000)],
              [+(midProb - 0.05).toFixed(3), Math.round(7000 + Math.random() * 6000)],
            ],
            asks: [
              [+(midProb + 0.01).toFixed(3), Math.round(1000 + Math.random() * 2000)],
              [+(midProb + 0.02).toFixed(3), Math.round(1800 + Math.random() * 2800)],
              [+(midProb + 0.03).toFixed(3), Math.round(3200 + Math.random() * 3800)],
              [+(midProb + 0.04).toFixed(3), Math.round(4800 + Math.random() * 4500)],
              [+(midProb + 0.05).toFixed(3), Math.round(6500 + Math.random() * 6000)],
            ],
          };
        });
      }
    }, 1200);

    return () => clearInterval(tickInterval);
  }, [selectedAsset]);

  // Periodic settlement simulation for visual demonstration
  useEffect(() => {
    const settleInterval = setInterval(() => {
      // Pick an active call to settle
      setActiveCalls((calls) => {
        if (calls.length === 0) return calls;
        const callToSettle = calls[0];
        const isWin = Math.random() > 0.4;
        const resolution = isWin ? "won" : "lost";

        if (isWin) {
          playWinCue();
        } else {
          playLossCue();
        }

        const settled: CallItem = {
          ...callToSettle,
          resolution,
          settlementTxHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
          payout: isWin ? callToSettle.positionSize * 1.85 : 0,
        };

        setRecentSettlements((prev) => [settled, ...prev.slice(0, 9)]);

        // Push activity
        setActivities((prev) => [
          {
            id: `act-${Date.now()}`,
            message: `${settled.agentName} settled ${settled.asset} ${settled.direction.toUpperCase()} · ${resolution.toUpperCase()} ${isWin ? "+8.5% PnL" : "-100%"}`,
            timestamp: Date.now(),
            category: "settlement",
          },
          ...prev.slice(0, 19),
        ]);

        // Re-rank agents
        setRankings((prevRankings) => {
          return prevRankings
            .map((r) => {
              if (r.agentId === settled.agentId) {
                const repDelta = isWin ? +25 : -30;
                const newRep = Math.max(100, r.reputation + repDelta);
                const badge = newRep >= 850 ? "verified" : "unreliable";
                return {
                  ...r,
                  reputation: newRep,
                  badge: badge as any,
                  wins: r.wins + (isWin ? 1 : 0),
                  losses: r.losses + (isWin ? 0 : 1),
                  totalCalls: r.totalCalls + 1,
                  cumulativePnl: +(r.cumulativePnl + (isWin ? 18.5 : -10.0)).toFixed(1),
                  winRate: +((r.wins + (isWin ? 1 : 0)) / (r.totalCalls + 1)).toFixed(3),
                };
              }
              return r;
            })
            .sort((a, b) => b.reputation - a.reputation);
        });

        // Spawn a fresh in-flight call to replace it
        const nextCall: CallItem = {
          id: `call-${Date.now()}`,
          agentId: settled.agentId,
          agentName: settled.agentName,
          agentArchetype: settled.agentArchetype,
          marketId: "ec-btc-15m",
          asset: Math.random() > 0.5 ? "BTC" : "ETH",
          direction: Math.random() > 0.5 ? "up" : "down",
          windowSeconds: 900,
          entryTimestamp: Date.now(),
          entryPrice: +(0.48 + Math.random() * 0.08).toFixed(2),
          expiryTimestamp: Date.now() + 750000,
          positionSize: Math.round(150 + Math.random() * 200),
          orderTxHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
          reasoning: `${settled.agentName} initiated new fixed-window position with high conviction.`,
        };

        return [...calls.slice(1), nextCall];
      });
    }, 24000);

    return () => clearInterval(settleInterval);
  }, []);

  const addHumanChallenge = useCallback((callId: string, userAddress: string) => {
    setActiveCalls((calls) => {
      const target = calls.find((c) => c.id === callId);
      if (!target) return calls;
      const oppositeDir = target.direction === "up" ? "down" : "up";

      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          message: `👤 Challenger ${userAddress.slice(0, 6)}… challenged ${target.agentName} taking ${oppositeDir.toUpperCase()} side!`,
          timestamp: Date.now(),
          category: "agent",
        },
        ...prev,
      ]);

      return calls.map((c) => (c.id === callId ? { ...c, userAddress } : c));
    });
  }, []);

  return {
    btcPrice,
    ethPrice,
    recentTicks,
    orderBook,
    activeCalls,
    recentSettlements,
    activities,
    rankings,
    isConnected,
    addHumanChallenge,
  };
}
