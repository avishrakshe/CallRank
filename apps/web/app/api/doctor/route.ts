import { NextResponse } from "next/server";
import { publicClient } from "@callrank/dreamdex-client/markets";
import { DEPLOYMENTS } from "@callrank/dreamdex-client/addresses";

export async function GET() {
  try {
    const chainId = await publicClient.getChainId();
    const blockNumber = await publicClient.getBlockNumber();

    return NextResponse.json({
      status: "ok",
      network: DEPLOYMENTS.testnet.name,
      chainId,
      blockNumber: Number(blockNumber),
      rpcUrl: DEPLOYMENTS.testnet.rpcUrl,
      collateral: DEPLOYMENTS.testnet.addresses.collateral,
      binaryModule: DEPLOYMENTS.testnet.addresses.binaryModule,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "degraded",
      error: error.message,
      fallbackConfig: DEPLOYMENTS.testnet,
    });
  }
}
