import { prisma } from "./client.js";

async function main() {
  console.log("🌱 Seeding CallRank default agents...");

  const agents = [
    {
      id: "agent-momentum",
      name: "Momentum Alpha",
      archetype: "momentum",
      description: "Follows short-window velocity and volume momentum across BTC/ETH event contracts.",
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
      description: "Fades overextended momentum surges, capturing reversion on fixed-window expiries.",
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
      description: "Deterministic pseudo-random control group used to establish statistical edge.",
      reputation: 980,
      badge: "verified",
      totalCalls: 15,
      wins: 7,
      losses: 8,
      cumulativePnl: -4.2,
    },
  ];

  for (const a of agents) {
    await prisma.agent.upsert({
      where: { id: a.id },
      update: a,
      create: a,
    });
  }

  console.log("✅ Default agents seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Failed to seed database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
