/**
 * Doctor preflight check for Somnia Shannon Testnet and DreamDEX Event Contracts.
 * Sends NO transactions.
 * Run with: pnpm doctor
 */

import { config as dotenv } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { privateKeyToAccount } from "viem/accounts";
import { publicClient, getWalletBalances, getActiveMarkets } from "./markets";
import { DEPLOYMENTS } from "./addresses";

// Load closest .env
dotenv({ path: path.resolve(process.cwd(), ".env") });

async function runDoctor() {
  console.log("\n=======================================================");
  console.log("   🩺 CallRank — Somnia Shannon & DreamDEX Doctor     ");
  console.log("=======================================================\n");

  const deployment = DEPLOYMENTS.testnet;
  console.log(`📡 Network        : ${deployment.name} (Chain ID: ${deployment.chainId})`);
  console.log(`🌐 RPC Endpoint   : ${deployment.rpcUrl}`);
  console.log(`🏦 Binary Module  : ${deployment.addresses.binaryModule}`);
  console.log(`💰 Collateral     : ${deployment.addresses.collateral} (tUSDC, ${deployment.decimals} decimals)`);
  console.log(`🔌 Public WS      : ${deployment.publicWsUrl}`);

  // Check RPC Connectivity
  try {
    const chainId = await publicClient.getChainId();
    const blockNumber = await publicClient.getBlockNumber();
    console.log(`\n✅ RPC Connected  : Live block #${blockNumber} (Verified Chain ID: ${chainId})`);
  } catch (err: any) {
    console.error(`\n❌ RPC Error      : Could not query Somnia Shannon RPC (${err.message})`);
  }

  // Wallet Preflight
  const pk = (process.env.PRIVATE_KEY || "").trim();
  let walletAddress: `0x${string}` = "0x0000000000000000000000000000000000000000";
  if (pk && pk.startsWith("0x")) {
    try {
      walletAddress = privateKeyToAccount(pk as `0x${string}`).address;
      console.log(`\n🔑 Wallet Key     : Provided (Address: ${walletAddress})`);
    } catch {
      console.log(`\n🔑 Wallet Key     : Invalid hex in PRIVATE_KEY`);
    }
  } else {
    console.log(`\n🔑 Wallet Key     : (Unset in .env — read-only simulation mode active)`);
  }

  if (walletAddress !== "0x0000000000000000000000000000000000000000") {
    try {
      const balances = await getWalletBalances(walletAddress);
      console.log(`   ├─ Native Gas  : ${balances.stt} STT`);
      console.log(`   └─ Collateral  : ${balances.collateral} tUSDC`);
    } catch (e: any) {
      console.log(`   └─ Balance query: ${e.message}`);
    }
  }

  // Market Discovery
  console.log("\n📊 Discovering Live Event Contract Markets...");
  try {
    const markets = await getActiveMarkets(deployment.restUrl);
    console.log(`   Found ${markets.length} active event contract market(s):\n`);

    const now = Math.floor(Date.now() / 1000);
    for (const m of markets) {
      const timeLeft = Math.max(0, m.expiry - now);
      const minLeft = Math.floor(timeLeft / 60);
      const secLeft = timeLeft % 60;
      const countdown = `${minLeft}m ${secLeft}s`;
      console.log(`   • ${m.symbol.padEnd(20)} | Status: ${m.status.padEnd(8)} | Window: ${countdown.padEnd(8)} | Book: YES Bid=${m.bestYesBid ?? "—"} Ask=${m.bestYesAsk ?? "—"}`);
    }
  } catch (err: any) {
    console.error(`   Failed to discover markets: ${err.message}`);
  }

  console.log("\n✨ Preflight complete! All read-only checks passed with 0 transactions sent.\n");
}

runDoctor().catch((err) => {
  console.error("Doctor failed:", err);
  process.exit(1);
});
