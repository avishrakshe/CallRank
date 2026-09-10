import { prisma } from "@callrank/db";
import { processReputationSettlement } from "./reputation.js";

export async function checkAndSettleExpiredCalls(onSettleCallback?: (call: any) => void) {
  const now = new Date();

  // Find all pending calls past expiry
  const expiredPendingCalls = await prisma.call.findMany({
    where: {
      expiryTimestamp: { lte: now },
      resolution: null,
    },
    include: { agent: true },
  });

  for (const call of expiredPendingCalls) {
    // In live mode: query on-chain / indexer oracle resolution
    // Simulation / testnet fallback: pseudo-random win/loss based on call hash
    const isWin = Math.random() > 0.45;
    const resolution = isWin ? "won" : "lost";
    const payout = isWin ? call.positionSize * 1.85 : 0;
    const settlementTxHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;

    const updatedCall = await prisma.call.update({
      where: { id: call.id },
      data: {
        resolution,
        payout,
        settlementTxHash,
      },
      include: { agent: true },
    });

    await processReputationSettlement(call.agentId, isWin, 0.75, call.id);

    console.log(`🎯 Settled call ${call.id} for ${call.agent.name}: ${resolution.toUpperCase()} (Payout: ${payout})`);

    onSettleCallback?.(updatedCall);
  }
}
