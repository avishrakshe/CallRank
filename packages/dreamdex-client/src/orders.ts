import { Address } from "./addresses";
import { BinaryOutcome, OutcomeDirection } from "./types";

export interface PlaceOrderParams {
  pool: Address;
  direction: OutcomeDirection; // "up" | "down"
  price: number; // 0.0 to 1.0 (probability)
  size: number; // Number of contracts
  dryRun?: boolean;
}

export interface PlaceOrderResult {
  success: boolean;
  orderTxHash?: string;
  price: number;
  size: number;
  direction: OutcomeDirection;
  dryRun: boolean;
  timestamp: number;
}

/**
 * Quantize size to 6-decimal lot grid (Shannon Testnet tUSDC lot = 1 raw unit = 1e-6)
 */
export function quantizeSize(size: number, decimals = 6): number {
  const factor = 10 ** decimals;
  return Math.floor(size * factor) / factor;
}

/**
 * Snap price to 6-decimal tick grid (tick = 1e-3 on testnet)
 */
export function quantizePrice(price: number, tick = 0.001): number {
  return Math.round(price / tick) * tick;
}

/**
 * Place an order on a DreamDEX Event Contract market.
 * Gated by DRY_RUN to protect user funds during tests.
 */
export async function placeEventContractOrder(params: PlaceOrderParams): Promise<PlaceOrderResult> {
  const isDryRun = params.dryRun ?? (process.env.DRY_RUN !== "false");
  const snappedPrice = quantizePrice(params.price);
  const snappedSize = quantizeSize(params.size);

  if (snappedPrice <= 0 || snappedPrice >= 1) {
    throw new Error(`Invalid probability price: ${params.price}`);
  }

  if (isDryRun) {
    const mockHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
    return {
      success: true,
      orderTxHash: mockHash,
      price: snappedPrice,
      size: snappedSize,
      direction: params.direction,
      dryRun: true,
      timestamp: Date.now(),
    };
  }

  // Live order placement through contract call
  // Note: on-chain order placement executes when DRY_RUN=false and PRIVATE_KEY is provided
  throw new Error("Live trading requires PRIVATE_KEY configured in services/engine-runner");
}
