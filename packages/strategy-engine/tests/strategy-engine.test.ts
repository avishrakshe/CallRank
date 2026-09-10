import { describe, it, expect } from "vitest";
import { evaluateMomentum, evaluateContrarian, evaluateRandomBaseline, MarketSnapshot } from "../src/index.js";

describe("Deterministic Strategy Engine", () => {
  const bullishFixture: MarketSnapshot = {
    marketId: "ec-btc-15m-fixture-1",
    asset: "BTC",
    spotPrice: 88500,
    priceHistory: [88000, 88150, 88300, 88420, 88500],
    contractPrice: 0.54,
    secondsToExpiry: 600,
  };

  const bearishFixture: MarketSnapshot = {
    marketId: "ec-eth-15m-fixture-2",
    asset: "ETH",
    spotPrice: 3100,
    priceHistory: [3150, 3140, 3125, 3110, 3100],
    contractPrice: 0.44,
    secondsToExpiry: 450,
  };

  it("Momentum Agent follows positive trend", () => {
    const decision = evaluateMomentum(bullishFixture);
    expect(decision.direction).toBe("up");
    expect(decision.confidence).toBeGreaterThan(0.5);
    expect(decision.reasoning).toContain("UP");
  });

  it("Momentum Agent follows negative trend", () => {
    const decision = evaluateMomentum(bearishFixture);
    expect(decision.direction).toBe("down");
    expect(decision.confidence).toBeGreaterThan(0.5);
    expect(decision.reasoning).toContain("DOWN");
  });

  it("Contrarian Agent fades positive trend into DOWN", () => {
    const decision = evaluateContrarian(bullishFixture);
    expect(decision.direction).toBe("down");
    expect(decision.confidence).toBeGreaterThan(0.5);
    expect(decision.reasoning).toContain("Fading");
  });

  it("Contrarian Agent fades negative trend into UP", () => {
    const decision = evaluateContrarian(bearishFixture);
    expect(decision.direction).toBe("up");
    expect(decision.confidence).toBeGreaterThan(0.5);
    expect(decision.reasoning).toContain("Fading");
  });

  it("Random Baseline is deterministic for identical input", () => {
    const decision1 = evaluateRandomBaseline(bullishFixture);
    const decision2 = evaluateRandomBaseline(bullishFixture);
    expect(decision1.direction).toBe(decision2.direction);
    expect(decision1.confidence).toBe(0.5);
    expect(decision1.reasoning).toContain("Control baseline");
  });
});
