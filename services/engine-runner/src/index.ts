import { config as dotenv } from "dotenv";
import path from "node:path";
import { getActiveMarkets, DreamDexWs } from "@callrank/dreamdex-client";
import { evaluateMomentum, evaluateContrarian, evaluateRandomBaseline, MarketSnapshot } from "@callrank/strategy-engine";
import { prisma } from "@callrank/db";
import { checkAndSettleExpiredCalls } from "./settlementTracker.js";

dotenv({ path: path.resolve(process.cwd(), ".env") });

const DRY_RUN = process.env.DRY_RUN !== "false";

async function main() {
  console.log("=================================================");
  console.log("   🚀 CallRank Autonomous Strategy Engine Runner  ");
  console.log(`   Mode: ${DRY_RUN ? "🛡️ DRY_RUN (Simulation)" : "⚡ LIVE TESTNET TRADING"} `);
  console.log("=================================================");

  // Connect DreamDEX WebSocket
  const ws = new DreamDexWs();
  ws.connect();

  ws.on("connected", () => {
    console.log("📡 Connected to DreamDEX public WebSocket stream");
  });

  ws.on("live_event", (event) => {
    if (event.type === "price_tick") {
      // Optional tick logging
    }
  });

  // Main evaluation and settlement loop (runs every 15s)
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
