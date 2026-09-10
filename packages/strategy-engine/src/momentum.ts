import { MarketSnapshot, StrategyDecision } from "./types";

/**
 * Momentum Agent: Enters in the direction of recent price movement.
 * Evaluates short-window velocity and contract implied probability.
 */
export function evaluateMomentum(snapshot: MarketSnapshot): StrategyDecision {
  const history = snapshot.priceHistory;
  if (!history || history.length < 2) {
    return {
      direction: "up",
      confidence: 0.5,
      reasoning: `Insufficient price history for ${snapshot.asset}; defaulted to UP with neutral confidence.`,
    };
  }

  const first = history[0];
  const last = history[history.length - 1];
  const delta = last - first;
  const pctChange = (delta / first) * 100;

  const direction = delta >= 0 ? "up" : "down";
  // Scale confidence based on magnitude of velocity (capped at 0.95)
  const confidence = Math.min(0.95, Math.max(0.55, 0.5 + Math.abs(pctChange) * 2));

  const sign = delta >= 0 ? "+" : "";
  const reasoning = `Observed ${sign}${pctChange.toFixed(3)}% ${direction.toUpperCase()} trend across last ${history.length} ticks. Following momentum into expiry in ${Math.round(snapshot.secondsToExpiry / 60)}m.`;

  return {
    direction,
    confidence: +confidence.toFixed(2),
    reasoning,
  };
}
