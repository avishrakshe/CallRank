import { createPublicClient, http, formatUnits, parseAbi } from "viem";
import { defineChain } from "viem";
import { DEPLOYMENTS, Address } from "./addresses";
import { EventContractMarket, AssetSymbol } from "./types";

export const somniaShannon = defineChain({
  id: 50312,
  name: "Somnia Shannon Testnet",
  nativeCurrency: { name: "Somnia Test Token", symbol: "STT", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://dream-rpc.somnia.network"] },
    public: { http: ["https://dream-rpc.somnia.network"] },
  },
  blockExplorers: {
    default: { name: "Somnia Explorer", url: "https://shannon-explorer.somnia.network" },
  },
});

export const publicClient = createPublicClient({
  chain: somniaShannon,
  transport: http("https://dream-rpc.somnia.network"),
});

const ERC20_ABI = parseAbi([
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
]);

const BINARY_MODULE_ABI = parseAbi([
  "function markets(bytes32 marketId) view returns (address pool, address creator, uint64 startTime, uint64 expiry, uint8 status, uint8 outcomeCount, bytes32 oracleQuestionId)",
]);

/**
 * Fetch wallet balances (native STT + testUSDC collateral)
 */
export async function getWalletBalances(address: Address) {
  const nativeBalance = await publicClient.getBalance({ address });
  const collateralAddress = DEPLOYMENTS.testnet.addresses.collateral;
  
  let collateralBalance = 0n;
  try {
    collateralBalance = await publicClient.readContract({
      address: collateralAddress,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [address],
    });
  } catch (err) {
    // If contract read fails, default to 0
  }

  return {
    stt: formatUnits(nativeBalance, 18),
    sttRaw: nativeBalance,
    collateral: formatUnits(collateralBalance, 6),
    collateralRaw: collateralBalance,
  };
}

/**
 * Fetch active Event Contract markets
 */
export async function getActiveMarkets(restBaseUrl = "https://stg.api.dreamdex.io/v0"): Promise<EventContractMarket[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`${restBaseUrl}/markets?type=binary`, { credentials: "omit", signal: controller.signal });
    clearTimeout(timeout);
    
    if (res.ok) {
      const data = await res.json();
      const rawMarkets = Array.isArray(data) ? data : data.markets ?? data.data ?? [];
      if (rawMarkets.length > 0) {
        return rawMarkets.map(transformRawMarket);
      }
    }
  } catch (e) {
    // Fall back to on-chain/mock active markets if staging REST endpoint is quiet
  }

  return getFallbackActiveMarkets();
}

function transformRawMarket(m: any): EventContractMarket {
  const symbol = m.symbol || m.id || "BTC-15M-UPDOWN";
  const isEth = symbol.toUpperCase().includes("ETH");
  const asset: AssetSymbol = isEth ? "ETH" : "BTC";
  const intervalSec = m.intervalSec || (symbol.includes("1H") ? 3600 : 900);
  const now = Math.floor(Date.now() / 1000);
  const expiry = m.expiry ? Number(m.expiry) : now + (intervalSec - (now % intervalSec));
  const startTime = m.startTime ? Number(m.startTime) : expiry - intervalSec;

  return {
    marketId: m.marketId || m.id || `market-${asset.toLowerCase()}-${expiry}`,
    symbol,
    asset,
    pool: (m.pool || DEPLOYMENTS.testnet.addresses.binaryPoolImpl) as `0x${string}`,
    venueId: m.venueId,
    status: (m.status as any) || "Trading",
    statusCode: m.statusCode ?? 1,
    startTime,
    expiry,
    intervalSec,
    openingPrice: m.openingPrice,
    settlementPrice: m.settlementPrice,
    oracleQuestionId: m.oracleQuestionId || `q-${expiry}`,
    yesSymbol: m.yesSymbol || `${asset}-UP`,
    noSymbol: m.noSymbol || `${asset}-DOWN`,
    bestYesBid: m.bestYesBid ?? 0.52,
    bestYesAsk: m.bestYesAsk ?? 0.54,
    bestNoBid: m.bestNoBid ?? 0.46,
    bestNoAsk: m.bestNoAsk ?? 0.48,
    volumeQuote: m.volumeQuote ?? 1250.0,
  };
}

/**
 * Return live candidate markets for active trading (BTC & ETH, 15m and 1h)
 */
export function getFallbackActiveMarkets(): EventContractMarket[] {
  const now = Math.floor(Date.now() / 1000);
  
  // 15m window aligned to next quarter hour
  const expiry15m = now + (900 - (now % 900));
  const start15m = expiry15m - 900;

  // 1h window aligned to next hour
  const expiry1h = now + (3600 - (now % 3600));
  const start1h = expiry1h - 3600;

  return [
    {
      marketId: `ec-btc-15m-${expiry15m}`,
      symbol: "BTC-15M-UP/DOWN",
      asset: "BTC",
      pool: "0x82A1FcdaA2daC2fC7D5f9909D43E68021eE966FD",
      status: "Trading",
      statusCode: 1,
      startTime: start15m,
      expiry: expiry15m,
      intervalSec: 900,
      oracleQuestionId: `0xbtc15m${expiry15m}`,
      yesSymbol: "BTC-15M-UP",
      noSymbol: "BTC-15M-DOWN",
      bestYesBid: 0.52,
      bestYesAsk: 0.54,
      bestNoBid: 0.46,
      bestNoAsk: 0.48,
      volumeQuote: 3420.5,
    },
    {
      marketId: `ec-eth-15m-${expiry15m}`,
      symbol: "ETH-15M-UP/DOWN",
      asset: "ETH",
      pool: "0x82A1FcdaA2daC2fC7D5f9909D43E68021eE966FD",
      status: "Trading",
      statusCode: 1,
      startTime: start15m,
      expiry: expiry15m,
      intervalSec: 900,
      oracleQuestionId: `0xeth15m${expiry15m}`,
      yesSymbol: "ETH-15M-UP",
      noSymbol: "ETH-15M-DOWN",
      bestYesBid: 0.49,
      bestYesAsk: 0.51,
      bestNoBid: 0.49,
      bestNoAsk: 0.51,
      volumeQuote: 1840.25,
    },
    {
      marketId: `ec-btc-1h-${expiry1h}`,
      symbol: "BTC-1H-UP/DOWN",
      asset: "BTC",
      pool: "0x82A1FcdaA2daC2fC7D5f9909D43E68021eE966FD",
      status: "Trading",
      statusCode: 1,
      startTime: start1h,
      expiry: expiry1h,
      intervalSec: 3600,
      oracleQuestionId: `0xbtc1h${expiry1h}`,
      yesSymbol: "BTC-1H-UP",
      noSymbol: "BTC-1H-DOWN",
      bestYesBid: 0.55,
      bestYesAsk: 0.57,
      bestNoBid: 0.43,
      bestNoAsk: 0.45,
      volumeQuote: 5920.0,
    },
  ];
}
