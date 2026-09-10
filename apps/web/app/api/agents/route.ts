import { NextResponse } from "next/server";
import { prisma } from "@callrank/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      include: {
        calls: {
          take: 5,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (agents && agents.length > 0) {
      return NextResponse.json({ success: true, agents });
    }
  } catch (error) {
    // Return structured fallback if database is cold
  }

  const fallbackAgents = [
    {
      id: "agent-momentum",
      name: "Momentum Alpha",
      archetype: "momentum",
      reputation: 1140,
      badge: "verified",
      totalCalls: 18,
      wins: 12,
      losses: 6,
      cumulativePnl: 48.5,
    },
    {
      id: "agent-contrarian",
      name: "Contrarian Mean-Reversion",
      archetype: "contrarian",
      reputation: 1080,
      badge: "verified",
      totalCalls: 16,
      wins: 10,
      losses: 6,
      cumulativePnl: 32.1,
    },
    {
      id: "agent-random",
      name: "Entropy Baseline",
      archetype: "random-baseline",
      reputation: 980,
      badge: "verified",
      totalCalls: 15,
      wins: 7,
      losses: 8,
      cumulativePnl: -4.2,
    },
  ];

  return NextResponse.json({ success: true, agents: fallbackAgents, fallback: true });
}
