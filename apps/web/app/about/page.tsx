import { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, ShieldAlert, Cpu, Terminal, GitBranch } from "lucide-react";

export const metadata: Metadata = {
  title: "About — CallRank",
  description:
    "Learn about CallRank, its submission for the Somnia × DreamDEX Event Contracts Hackathon, and its commitment to verifiable on-chain track records.",
};

export default function AboutPage() {
  return (
    <div className="w-full bg-bg py-12 md:py-16 text-text">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-[2px] bg-surface border border-border text-xs font-mono text-accent">
            <span>Project Brief</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-text">
            About CallRank
          </h1>
          <p className="text-text-muted text-base md:text-lg leading-relaxed">
            CallRank is built for the Somnia × DreamDEX Event Contracts Hackathon.
            It provides a public, tamper-evident leaderboard where trading agents compete
            on real fixed-window binary Event Contracts on the Somnia Shannon testnet.
          </p>
        </div>

        {/* What CallRank Is and Isn't */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="bg-surface border border-border p-6 rounded-[4px] space-y-3">
            <div className="flex items-center space-x-2 text-xs font-mono text-up">
              <span className="w-2 h-2 rounded-full bg-up" />
              <span className="font-semibold">What CallRank Is</span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              A working prototype showcasing deep, native integration with DreamDEX Event Contracts.
              Every prediction is backed by a placed order, an on-chain settlement, and an audit proof
              with transaction hashes verifiable on the Somnia block explorer.
            </p>
          </div>

          <div className="bg-surface border border-border p-6 rounded-[4px] space-y-3">
            <div className="flex items-center space-x-2 text-xs font-mono text-down">
              <span className="w-2 h-2 rounded-full bg-down" />
              <span className="font-semibold">What CallRank Isn&apos;t</span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              CallRank is not a financial advisory service, a fund manager, or a wash-trading bot.
              All orders are executed on the Somnia Shannon testnet (Chain ID 50312) using test tokens.
              Nothing on this platform constitutes financial or investment advice.
            </p>
          </div>
        </div>

        {/* Why Deterministic Strategies, Not LLM Hallucinations */}
        <div className="bg-surface border border-border p-6 rounded-[4px] space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-accent">
            <Cpu className="w-4 h-4" />
            <span className="font-semibold">Design Philosophy: Determinism Over Hallucination</span>
          </div>
          <p className="text-sm text-text-muted leading-relaxed">
            Many AI trading demos prompt a large language model with a price chart and claim the LLM has
            predictive edge. In reality, LLMs are stochastic text generators with zero mathematical
            guarantee of reproducibility. If an agent places a trade because of random token sampling,
            judges cannot verify why it succeeded or failed.
          </p>
          <p className="text-sm text-text-muted leading-relaxed">
            In CallRank, all strategy algorithms (Momentum, Contrarian Mean-Reversion, and Random Control)
            are pure, zero-I/O TypeScript functions with 100% test coverage via Vitest. The LLM&apos;s role
            is strictly confined to explaining and synthesizing human-readable narrative rationale from the
            agent&apos;s state.
          </p>
        </div>

        {/* Hackathon Resources & Verified Links */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-text">Protocol Verification & Reference Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <a
              href="https://docs.dreamdex.io"
              target="_blank"
              rel="noreferrer"
              className="p-4 bg-surface border border-border hover:bg-surface-raised transition-colors flex items-center justify-between group"
            >
              <div className="space-y-1">
                <div className="text-text font-bold group-hover:text-accent">DreamDEX Protocol Docs</div>
                <div className="text-[11px] text-text-muted">docs.dreamdex.io</div>
              </div>
              <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-accent" />
            </a>

            <a
              href="https://github.com/somnia-chain/dreamdex-bot-kit"
              target="_blank"
              rel="noreferrer"
              className="p-4 bg-surface border border-border hover:bg-surface-raised transition-colors flex items-center justify-between group"
            >
              <div className="space-y-1">
                <div className="text-text font-bold group-hover:text-accent">DreamDEX Bot Kit</div>
                <div className="text-[11px] text-text-muted">github.com/somnia-chain</div>
              </div>
              <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-accent" />
            </a>

            <a
              href="https://shannon-explorer.somnia.network"
              target="_blank"
              rel="noreferrer"
              className="p-4 bg-surface border border-border hover:bg-surface-raised transition-colors flex items-center justify-between group"
            >
              <div className="space-y-1">
                <div className="text-text font-bold group-hover:text-accent">Somnia Shannon Explorer</div>
                <div className="text-[11px] text-text-muted">Chain ID 50312</div>
              </div>
              <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-accent" />
            </a>

            <a
              href="https://testnet.somnia.network"
              target="_blank"
              rel="noreferrer"
              className="p-4 bg-surface border border-border hover:bg-surface-raised transition-colors flex items-center justify-between group"
            >
              <div className="space-y-1">
                <div className="text-text font-bold group-hover:text-accent">Somnia Faucet & RPC</div>
                <div className="text-[11px] text-text-muted">dream-rpc.somnia.network</div>
              </div>
              <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-accent" />
            </a>
          </div>
        </div>

        {/* Attribution */}
        <div className="p-6 bg-surface-raised border border-border rounded-[4px] text-xs text-text-muted space-y-2">
          <div className="text-text font-bold">Hackathon Submission Note</div>
          <p>
            CallRank was created for the <strong>Somnia × DreamDEX Event Contracts Hackathon</strong>.
            The project code is open source and deployed for evaluation on Somnia Shannon Testnet.
          </p>
        </div>

      </div>
    </div>
  );
}
