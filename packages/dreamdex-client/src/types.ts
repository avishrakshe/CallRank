/**
 * Shared types for DreamDEX Event Contracts, Live WebSocket Events, and Strategy Execution.
 */

export type AssetSymbol = "BTC" | "ETH";
export type OutcomeDirection = "up" | "down";
export type BinaryOutcome = "YES" | "NO";

export interface EventContractMarket {
  marketId: string;
  symbol: string;
  asset: AssetSymbol;
  pool: `0x${string}`;
  venueId?: `0x${string}`;
  status: "Listed" | "Trading" | "Locked" | "Resolved" | "Voided";
  statusCode: number; // 0=Listed, 1=Trading, 2=Locked, 4=Resolved, 5=Voided
  startTime: number;
  expiry: number;
  intervalSec: number; // 900 (15m) or 3600 (1h)
  openingPrice?: number;
  settlementPrice?: number;
  oracleQuestionId?: string;
  yesSymbol: string;
  noSymbol: string;
  bestYesBid?: number;
  bestYesAsk?: number;
  bestNoBid?: number;
  bestNoAsk?: number;
  volumeQuote?: number;
}

export interface MarketSnapshot {
  marketId: string;
  asset: AssetSymbol;
  spotPrice: number;
  priceHistory: number[]; // last N spot prices, short window
  contractPrice: number; // probability (0 to 1) for UP
  secondsToExpiry: number;
  bestBid: number;
  bestAsk: number;
  timestamp: number;
}

export interface StrategyDecision {
  direction: OutcomeDirection;
  confidence: number; // 0.0 to 1.0
  reasoning: string;
}

export type Strategy = (snapshot: MarketSnapshot) => StrategyDecision;

export interface OrderBookLevel {
  price: number;
  size: number;
}

export interface OrderBookState {
  marketId: string;
  bids: [number, number][]; // [price, size]
  asks: [number, number][];
  timestamp: number;
}

export interface CallItem {
  id: string;
  agentId: string;
  agentName: string;
  agentArchetype: string;
  marketId: string;
  asset: AssetSymbol;
  direction: OutcomeDirection;
  windowSeconds: number;
  entryTimestamp: number;
  entryPrice: number;
  expiryTimestamp: number;
  positionSize: number;
  orderTxHash?: string | null;
  resolution?: "won" | "lost" | "void" | null;
  settlementTxHash?: string | null;
  payout?: number | null;
  reasoning: string;
  userAddress?: string | null;
}

export interface AgentRanking {
  agentId: string;
  name: string;
  archetype: string;
  reputation: number;
  badge: "verified" | "unreliable";
  totalCalls: number;
  wins: number;
  losses: number;
  winRate: number;
  cumulativePnl: number;
  sharpeRatio: number;
  activeCalls: number;
}

/**
 * Live Event Stream Taxonomy (Single WebSocket Feed)
 */
export type LiveEvent =
  | { type: "price_tick"; asset: AssetSymbol; price: number; ts: number }
  | { type: "orderbook_update"; marketId: string; bids: [number, number][]; asks: [number, number][]; ts: number }
  | { type: "market_update"; market: EventContractMarket }
  | { type: "call_placed"; call: CallItem }
  | { type: "call_settled"; call: CallItem; resultDelta: number }
  | { type: "reputation_change"; agentId: string; newReputation: number; newBadge: "verified" | "unreliable" }
  | { type: "leaderboard_update"; rankings: AgentRanking[] }
  | { type: "activity"; message: string; timestamp: number; category: "market" | "agent" | "settlement" };
