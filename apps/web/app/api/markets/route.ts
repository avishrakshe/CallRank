import { NextResponse } from "next/server";
import { getActiveMarkets, getFallbackActiveMarkets } from "@callrank/dreamdex-client/markets";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const markets = await getActiveMarkets();
    return NextResponse.json({ success: true, markets });
  } catch (error: any) {
    const fallback = getFallbackActiveMarkets();
    return NextResponse.json({ success: true, markets: fallback, fallback: true });
  }
}
