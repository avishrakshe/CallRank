export interface MarketSnapshot {
  marketId: string;
  asset: "BTC" | "ETH";
  spotPrice: number;
  priceHistory: number[]; // sequence of prices in current window
  contractPrice: number; // UP token price (0.0 to 1.0)
  secondsToExpiry: number;
}

export interface StrategyDecision {
  direction: "up" | "down";
  confidence: number; // 0.0 to 1.0
  reasoning: string;
}

export type Strategy = (snapshot: MarketSnapshot) => StrategyDecision;
