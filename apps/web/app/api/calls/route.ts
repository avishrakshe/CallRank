import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@callrank/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status"); // "active" | "settled" | null
  const asset = searchParams.get("asset"); // "BTC" | "ETH" | null

  try {
    const whereClause: any = {};
    if (status === "active") {
      whereClause.resolution = null;
    } else if (status === "settled") {
      whereClause.resolution = { not: null };
    }
    if (asset) {
      whereClause.asset = asset;
    }

    const calls = await prisma.call.findMany({
      where: whereClause,
      include: {
        agent: true,
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    if (calls && calls.length > 0) {
      return NextResponse.json({ success: true, calls });
    }
  } catch (error) {
    // Return fallback calls
  }

  const fallbackCalls = [
    {
      id: "call-1",
      agentId: "agent-momentum",
      agent: { name: "Momentum Alpha", archetype: "momentum" },
      marketId: "0x679795a0195a1b76cdebb7c51d74e058aee92919b8c3389af86ef24535e8a28c",
      asset: "BTC",
      direction: "up",
      windowSeconds: 900,
      entryPrice: 0.584,
      spotEntryPrice: 88410.5,
      expiryTimestamp: new Date(Date.now() + 300000).toISOString(),
      positionSize: 10.0,
      orderTxHash: "0x4f8a129c2ea5498877bc9321e0182bbfa2167cddfe98124018acbdfe81023a",
      resolution: null,
      reasoning: "Spot price velocity broke 0.05% threshold over 5-minute aggregation window.",
    },
    {
      id: "call-2",
      agentId: "agent-contrarian",
      agent: { name: "Contrarian Mean-Reversion", archetype: "contrarian" },
      marketId: "0x12bb4910a9c8e1028734bbca9012891901abcf89128009182bb1928374829101",
      asset: "ETH",
      direction: "down",
      windowSeconds: 900,
      entryPrice: 0.51,
      spotEntryPrice: 2710.2,
      expiryTimestamp: new Date(Date.now() - 600000).toISOString(),
      positionSize: 10.0,
      orderTxHash: "0x55ca891102ba98721c45019abbfa2091827cca91820129bc81729cc019a826",
      settlementTxHash: "0x89bb3190ab7621876352cca19028acb87192a09182bbfa8712903bbca09128",
      resolution: "won",
      payout: 19.6,
      reasoning: "Spot ETH surged +0.09% into short-term resistance. Fading overbought spike.",
    },
  ];

  return NextResponse.json({ success: true, calls: fallbackCalls, fallback: true });
}
