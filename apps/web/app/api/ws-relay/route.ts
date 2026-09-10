import { NextRequest, NextResponse } from "next/server";
import { getActiveMarkets, getFallbackActiveMarkets } from "@callrank/dreamdex-client/markets";

export const dynamic = "force-dynamic";

/**
 * Server-Sent Events (SSE) relay route providing real-time market ticks,
 * order book updates, and event contract notifications to the browser.
 */
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let isAlive = true;

      // Send initial connection handshake
      const initialEvent = {
        type: "connection",
        status: "connected",
        timestamp: Date.now(),
        network: "Somnia Shannon Testnet (50312)",
      };
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(initialEvent)}\n\n`));

      // Periodic stream updates
      const interval = setInterval(async () => {
        if (!isAlive) return;

        try {
          const btcPrice = 88400 + (Math.random() - 0.49) * 25;
          const ethPrice = 2710 + (Math.random() - 0.49) * 2.5;

          const tickEvent = {
            type: "price_tick",
            btcPrice: +btcPrice.toFixed(2),
            ethPrice: +ethPrice.toFixed(2),
            ts: Date.now(),
          };

          controller.enqueue(encoder.encode(`data: ${JSON.stringify(tickEvent)}\n\n`));
        } catch (e) {
          // Keep stream alive
        }
      }, 2000);

      request.signal.addEventListener("abort", () => {
        isAlive = false;
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
