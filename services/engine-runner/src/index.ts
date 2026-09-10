import { config as dotenv } from "dotenv";
import path from "node:path";
import {
  getActiveMarkets,
  getFallbackActiveMarkets,
  DreamDexWs,
  placeEventContractOrder,
  EventContractMarket,
} from "@callrank/dreamdex-client";
import {
  evaluateMomentum,
  evaluateContrarian,
  evaluateRandomBaseline,
  MarketSnapshot,
  StrategyDecision,
} from "@callrank/strategy-engine";
import { prisma } from "@callrank/db";
import { checkAndSettleExpiredCalls } from "./settlementTracker";

dotenv({ path: path.resolve(process.cwd(), ".env") });

const DRY_RUN = process.env.DRY_RUN !== "false";

interface AgentStrategyRunner {
  agentId: string;
  name: string;
  evaluate: (snapshot: MarketSnapshot) => StrategyDecision;
}

const RUNNERS: AgentStrategyRunner[] = [
  {
    agentId: "agent-momentum",
    name: "Momentum Alpha",
    evaluate: evaluateMomentum,
  },
  {
    agentId: "agent-contrarian",
    name: "Contrarian Mean-Reversion",
    evaluate: evaluateContrarian,
  },
  {
    agentId: "agent-random",
    name: "Entropy Baseline",
    evaluate: evaluateRandomBaseline,
  },
];

let btcPriceHistory: number[] = [88400, 88420, 88410, 88450];
let ethPriceHistory: number[] = [2705, 2708, 2707, 2710];

async function runStrategyEvaluationLoop() {
  try {
    let markets: EventContractMarket[];
    try {
      markets = await getActiveMarkets();
    } catch {
      markets = getFallbackActiveMarkets();
    }

    const now = Math.floor(Date.now() / 1000);

    for (const market of markets) {
      const asset = market.asset;
      const history = asset === "BTC" ? btcPriceHistory : ethPriceHistory;
      const currentSpot = history[history.length - 1];
      const secondsToExpiry = Math.max(60, market.expiry - now);

      const snapshot: MarketSnapshot = {
        marketId: market.marketId,
        asset: asset as "BTC" | "ETH",
        spotPrice: currentSpot,
        priceHistory: history,
        contractPrice: market.bestYesAsk ?? 0.54,
        secondsToExpiry,
      };

      for (const runner of RUNNERS) {
        // Check if agent already has an active pending call for this market
        const existingOpenCall = await prisma.call.findFirst({
          where: {
            agentId: runner.agentId,
            marketId: market.marketId,
            resolution: null,
          },
        });

        if (existingOpenCall) {
          continue; // Already has open exposure
        }

        const decision = runner.evaluate(snapshot);

        if (decision.confidence >= 0.4) {
          console.log(
            `\n🧠 [${runner.name}] Generated Decision on ${market.symbol}:`
          );
          console.log(
            `   Direction: ${decision.direction.toUpperCase()} | Confidence: ${(decision.confidence * 100).toFixed(0)}%`
          );
          console.log(`   Reasoning: "${decision.reasoning}"`);

          const orderPrice =
            decision.direction === "up"
              ? (market.bestYesAsk ?? 0.54)
              : (market.bestNoAsk ?? 0.46);
          const positionSize = 10.0;

          // Place order through client wrapper with DRY_RUN gate
          const orderResult = await placeEventContractOrder({
            pool: market.pool,
            direction: decision.direction,
            price: orderPrice,
            size: positionSize,
            dryRun: DRY_RUN,
          });

          const newCall = await prisma.call.create({
            data: {
              agentId: runner.agentId,
              marketId: market.marketId,
              asset: market.asset,
              direction: decision.direction,
              windowSeconds: market.intervalSec,
              entryTimestamp: new Date(),
              entryPrice: orderPrice,
              spotEntryPrice: currentSpot,
              expiryTimestamp: new Date(market.expiry * 1000),
              positionSize,
              orderTxHash: orderResult.orderTxHash,
              reasoning: decision.reasoning,
            },
          });

          console.log(
            `   ✅ Call registered: ${newCall.id} (Tx: ${orderResult.orderTxHash?.slice(0, 14)}...)`
          );
        }
      }
    }
  } catch (error: any) {
    console.error("Evaluation loop error:", error.message);
  }
}

async function main() {
  console.log("=================================================");
  console.log("   🚀 CallRank Autonomous Strategy Engine Runner  ");
  console.log(`   Mode: ${DRY_RUN ? "🛡️ DRY_RUN (Simulation)" : "⚡ LIVE TESTNET TRADING"} `);
  console.log("   Somnia Shannon Testnet · Chain ID 50312       ");
  console.log("=================================================");

  // Connect DreamDEX WebSocket
  const ws = new DreamDexWs();
  ws.connect();

  ws.on("connected", () => {
    console.log("📡 Connected to DreamDEX public WebSocket stream");
  });

  ws.on("live_event", (event) => {
    if (event.type === "price_tick") {
      if (event.asset === "BTC") {
        btcPriceHistory = [...btcPriceHistory.slice(-20), event.price];
      } else if (event.asset === "ETH") {
        ethPriceHistory = [...ethPriceHistory.slice(-20), event.price];
      }
    }
  });

  // Initial evaluation run
  await runStrategyEvaluationLoop();
  await checkAndSettleExpiredCalls();

  // Strategy Evaluation Loop (runs every 30s)
  setInterval(async () => {
    await runStrategyEvaluationLoop();
  }, 30000);

  // Settlement Tracker Loop (runs every 15s)
  setInterval(async () => {
    try {
      await checkAndSettleExpiredCalls();
    } catch (e: any) {
      console.error("Settlement cycle error:", e.message);
    }
  }, 15000);
}

main().catch((err) => {
  console.error("Engine runner failed to start:", err);
  process.exit(1);
});
