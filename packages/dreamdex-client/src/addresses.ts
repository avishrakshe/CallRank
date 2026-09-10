/**
 * Somnia Shannon Testnet & Mainnet Contract Deployments for DreamDEX Event Contracts
 * Verified from DreamDEX protocol specifications.
 */

export type Address = `0x${string}`;

export interface EcAddresses {
  collateral: Address;
  testUsdc: Address;
  binaryModule: Address;
  marketsCore: Address;
  marketCreator: Address;
  clobFactory: Address;
  binaryPoolImpl: Address;
  binarySettlement: Address;
  collateralRouter: Address;
  marketCreatorFactory: Address;
  oracleHub: Address;
}

export interface NetworkDeployment {
  chainId: number;
  name: string;
  decimals: number;
  rpcUrl: string;
  wsUrl: string;
  restUrl: string;
  publicWsUrl: string;
  addresses: EcAddresses;
}

const CORE_ADDRESSES = {
  binaryModule: "0x3ecC694Cef705358864a646142ac17A90E29e388" as Address,
  marketsCore: "0x2802504314685D89bF6C992CA5a8e7cC78bc0294" as Address,
  clobFactory: "0xb2BE8EE02F96379DB75f01802384593EBa9bfF04" as Address,
  binaryPoolImpl: "0x82A1FcdaA2daC2fC7D5f9909D43E68021eE966FD" as Address,
  binarySettlement: "0xbF4a49e0Dfd092e5FBE8E5761064C49533e6Ed23" as Address,
  collateralRouter: "0xbC0C9834B15ACE38bB50dDaa7d7f7C7CC4DC183C" as Address,
  marketCreatorFactory: "0xE6bEE93cE87c9E6e62aCb621caa7832EE47b4F6B" as Address,
  oracleHub: "0xe40db387cC98601Dd11bd634fF2f3AD5686dE32b" as Address,
};

export const DEPLOYMENTS: Record<"testnet" | "mainnet", NetworkDeployment> = {
  testnet: {
    chainId: 50312,
    name: "Somnia Shannon Testnet",
    decimals: 6,
    rpcUrl: "https://dream-rpc.somnia.network",
    wsUrl: "wss://api.infra.testnet.somnia.network/ws",
    restUrl: "https://stg.api.dreamdex.io/v0",
    publicWsUrl: "wss://stg.api.dreamdex.io/v0/ws/public",
    addresses: {
      ...CORE_ADDRESSES,
      collateral: "0x70a86D8842FB63C4Ad2b7cdddF530eBf1BB25d8E" as Address,
      testUsdc: "0x70a86D8842FB63C4Ad2b7cdddF530eBf1BB25d8E" as Address,
      marketCreator: "0x5Ce69567dB39C8fBAd7e048bEfdbcCdfE67B44e6" as Address,
    },
  },
  mainnet: {
    chainId: 5031,
    name: "Somnia Mainnet",
    decimals: 18,
    rpcUrl: "https://api.infra.mainnet.somnia.network",
    wsUrl: "wss://api.infra.mainnet.somnia.network/ws",
    restUrl: "https://api.dreamdex.io/v0",
    publicWsUrl: "wss://api.dreamdex.io/v0/ws/public",
    addresses: {
      ...CORE_ADDRESSES,
      collateral: "0x00000022dA000002656c64D9eA6011ea952D008A" as Address,
      testUsdc: "0x00000022dA000002656c64D9eA6011ea952D008A" as Address,
      marketCreator: "0x62627805965705Cc303A7F6282DD5059921980aD" as Address,
    },
  },
};
