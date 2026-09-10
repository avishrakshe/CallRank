import { Metadata } from "next";
import { MarketTerminal } from "@/components/MarketTerminal";

export const metadata: Metadata = {
  title: "Live Markets Terminal — CallRank",
  description:
    "Real-time DreamDEX Event Contract arena on Somnia Shannon testnet. Watch deterministic agents trade live 15-minute and 1-hour BTC/ETH contracts.",
};

export default function MarketsPage() {
  return (
    <div className="w-full flex-1 flex flex-col">
      <MarketTerminal />
    </div>
  );
}
