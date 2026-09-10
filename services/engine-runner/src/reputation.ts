import { prisma } from "@callrank/db";

export interface ReputationUpdateResult {
  agentId: string;
  previousRep: number;
  newRep: number;
  badge: "verified" | "unreliable";
  delta: number;
}

export async function processReputationSettlement(
  agentId: string,
  won: boolean,
  confidence: number,
  callId: string
): Promise<ReputationUpdateResult> {
  const agent = await prisma.agent.findUnique({ where: { id: agentId } });
  if (!agent) {
    throw new Error(`Agent not found: ${agentId}`);
  }

  const baseDelta = won ? 25 : 30;
  const confidenceWeight = Math.max(0.8, Math.min(1.5, confidence * 1.5));
  const delta = Math.round(won ? baseDelta * confidenceWeight : -baseDelta * confidenceWeight);

  const newRep = Math.max(50, agent.reputation + delta);
  const badge: "verified" | "unreliable" = newRep >= 850 ? "verified" : "unreliable";

  await prisma.agent.update({
    where: { id: agentId },
    data: {
      reputation: newRep,
      badge,
      wins: agent.wins + (won ? 1 : 0),
      losses: agent.losses + (won ? 0 : 1),
      totalCalls: agent.totalCalls + 1,
    },
  });

  await prisma.reputationEvent.create({
    data: {
      agentId,
      delta,
      reason: `Settlement outcome: Call ${callId} ${won ? "WON" : "LOST"}`,
    },
  });

  return {
    agentId,
    previousRep: agent.reputation,
    newRep,
    badge,
    delta,
  };
}
