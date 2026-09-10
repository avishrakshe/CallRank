import { MarketSnapshot, StrategyDecision } from "./types";

/**
 * Contrarian Agent: Fades momentum signals, betting on mean-reversion
 * when short-term price has extended or when contract price is mispriced.
 */
export function evaluateContrarian(snapshot: MarketSnapshot): StrategyDecision {
  const history = snapshot.priceHistory;
  if (!history || history.length < 2) {
    return {
      direction: "down",
      confidence: 0.5,
      reasoning: `Defaulted to mean-reversion DOWN on ${snapshot.asset} due to minimal tick depth.`,
    };
  }

  const first = history[0];
  const last = history[history.length - 1];
  const delta = last - first;
  const pctChange = (delta / first) * 100;

  // Fades the direction of the recent move
  const direction = delta >= 0 ? "down" : "up";

  // Confidence scales with how over-extended the move is
  const confidence = Math.min(0.92, Math.max(0.55, 0.5 + Math.abs(pctChange) * 2.5));
  const fadedDir = delta >= 0 ? "bullish" : "bearish";
  const reasoning = `Detected ${fadedDir} surge of ${Math.abs(pctChange).toFixed(3)}%. Fading overextended move targeting mean reversion into expiry in ${Math.round(snapshot.secondsToExpiry / 60)}m.`;

  return {
    direction,
    confidence: +confidence.toFixed(2),
    reasoning,
  };
}
