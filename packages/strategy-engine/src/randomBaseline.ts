import { MarketSnapshot, StrategyDecision } from "./types";

/**
 * Simple deterministic hash for reproducible pseudo-random control baseline
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Random Baseline Agent: Serves as the control group.
 * Produces deterministic pseudo-random predictions based on marketId and secondsToExpiry.
 */
export function evaluateRandomBaseline(snapshot: MarketSnapshot): StrategyDecision {
  const seed = `${snapshot.marketId}-${snapshot.secondsToExpiry}-${snapshot.asset}`;
  const h = hashString(seed);
  const isUp = h % 2 === 0;
  const direction = isUp ? "up" : "down";
  const confidence = 0.5;

  return {
    direction,
    confidence,
    reasoning: `Control baseline prediction (${direction.toUpperCase()}) seeded deterministically by market entropy. Edge = 0.`,
  };
}
