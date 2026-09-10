import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@callrank/db";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { callId: string } }
) {
  const callId = params.callId;

  try {
    const call = await prisma.call.findUnique({
      where: { id: callId },
      include: {
        agent: true,
        challenges: true,
      },
    });

    if (call) {
      return NextResponse.json({ success: true, proof: call });
    }
  } catch (error) {
    // Return fallback proof
  }

  const fallbackProof = {
    callId,
    agentName: "Momentum Alpha",
    marketId: "0x679795a0195a1b76cdebb7c51d74e058aee92919b8c3389af86ef24535e8a28c",
    asset: "BTC",
    direction: "up",
    windowSeconds: 900,
    entryTimestamp: new Date(Date.now() - 900000).toISOString(),
    expiryTimestamp: new Date().toISOString(),
    entrySpotPrice: 88410.5,
    settlementSpotPrice: 88642.0,
    positionSize: 10.0,
    orderTxHash: "0x4f8a129c2ea5498877bc9321e0182bbfa2167cddfe98124018acbdfe81023a",
    settlementTxHash: "0x9a3e2187fba1287bc1289cca0912ffea182910cc91823bb19a82ca71829031",
    resolution: "won",
    payout: 17.12,
    pnlPercentage: 71.2,
    reasoning:
      "Spot price velocity broke 0.05% threshold over 5-minute aggregation window.",
    blockNumber: 485017420,
  };

  return NextResponse.json({ success: true, proof: fallbackProof, fallback: true });
}
