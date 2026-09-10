import { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  CheckCircle2,
  Code2,
  ExternalLink,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Features & Architecture — CallRank",
  description:
    "Explore CallRank's deterministic strategy engine, DreamDEX Event Contract lifecycle, reputation staking, and on-chain verifiable audit proofs.",
};

export default function FeaturesPage() {
  return (
    <div className="w-full bg-bg py-12 md:py-16 text-text">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-20">
        
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-[2px] bg-surface border border-border text-xs font-mono text-accent">
            <span>Protocol Architecture</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-text">
            How CallRank works under the hood
          </h1>
          <p className="text-text-muted text-base md:text-lg leading-relaxed">
            CallRank is built for the Somnia × DreamDEX Event Contracts Hackathon.
            Instead of black-box LLM guessing or synthetic volume generation,
            it executes an end-to-end verifiable trading loop on real binary prediction markets.
          </p>
        </div>

        {/* Section 1: The Live Terminal (Left: Visual Mock/Embed, Right: Text) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center border-t border-border pt-12">
          <div className="lg:col-span-6 order-2 lg:order-1 bg-surface border border-border p-5 rounded-[4px] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-up animate-pulse" />
                <span className="font-semibold text-text">DreamDEX Event Contract Feed</span>
              </div>
              <span className="text-[11px] font-mono text-text-muted">15m Window</span>
            </div>
            
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-surface-raised border border-border flex justify-between items-center">
                <div>
                  <div className="text-text font-bold">BTC:USDso-15m</div>
                  <div className="text-[11px] text-text-muted">Underlying: $88,450.00</div>
                </div>
                <div className="text-right">
                  <div className="text-up font-bold">UP 0.584 STT</div>
                  <div className="text-down text-[11px]">DOWN 0.416 STT</div>
                </div>
              </div>

              <div className="p-3 bg-surface-raised border border-border flex justify-between items-center">
                <div>
                  <div className="text-text font-bold">ETH:USDso-15m</div>
                  <div className="text-[11px] text-text-muted">Underlying: $2,710.20</div>
                </div>
                <div className="text-right">
                  <div className="text-up font-bold">UP 0.490 STT</div>
                  <div className="text-down text-[11px]">DOWN 0.510 STT</div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-bg border border-border text-[11px] font-mono text-text-muted flex items-center justify-between">
              <span>WebSocket relay: wss://stg.api.dreamdex.io</span>
              <span className="text-up font-semibold">Active</span>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
            <div className="text-xs font-mono text-accent font-semibold">01 · Market Discovery</div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text">
              Real DreamDEX Event Contracts in real time
            </h2>
            <p className="text-text-muted text-sm md:text-base leading-relaxed">
              Every market in CallRank represents a live binary Event Contract issued on the Somnia
              Shannon testnet through DreamDEX. A single order book is priced in UP tokens, with
              DOWN calculated deterministically as <code className="text-text font-mono">1 − UP</code>.
            </p>
            <p className="text-text-muted text-sm md:text-base leading-relaxed">
              When a contract opens, a 15-minute or 1-hour window begins. Agents evaluate the
              current orderbook depth, spot price delta, and time to expiry before committing collateral.
            </p>
            <div className="pt-2">
              <Link
                href="/markets"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-surface border border-border text-xs font-mono text-text hover:bg-surface-raised transition-colors"
              >
                <span>Launch live terminal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Section 2: Deterministic Strategies (Left: Text, Right: Code/Logic) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center border-t border-border pt-12">
          <div className="lg:col-span-6 space-y-4">
            <div className="text-xs font-mono text-accent font-semibold">02 · Strategy Engine</div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text">
              Deterministic, zero-I/O pure TypeScript strategies
            </h2>
            <p className="text-text-muted text-sm md:text-base leading-relaxed">
              We deliberately reject black-box LLM price forecasting. LLM token generation is
              unpredictable, unversioned, and impossible for hackathon judges to verify or backtest.
            </p>
            <p className="text-text-muted text-sm md:text-base leading-relaxed">
              Instead, CallRank uses pure mathematical strategies that take a strict snapshot of market
              state and return a decision with reproducible confidence and stated reasoning. We include
              a uniform Random Baseline agent as a scientific control group to prove whether momentum
              and mean-reversion generate statistical edge over pure chance.
            </p>
            <ul className="space-y-2 text-xs font-mono text-text-muted">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                <span><strong className="text-text">Momentum Alpha:</strong> Follows short-window velocity delta</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                <span><strong className="text-text">Contrarian Mean-Reversion:</strong> Fades overbought/oversold spikes</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                <span><strong className="text-text">Entropy Baseline:</strong> Control agent with seed-based random choices</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6 bg-surface border border-border p-5 rounded-[4px] shadow-sm font-mono text-xs space-y-3">
            <div className="flex items-center justify-between text-text-muted border-b border-border pb-2">
              <span>packages/strategy-engine/src/momentum.ts</span>
              <span className="text-up">Vitest Passed</span>
            </div>
            <pre className="text-text-muted bg-bg p-4 overflow-x-auto text-[11px] leading-relaxed border border-border">
{`export const evaluateMomentum: Strategy = (snapshot) => {
  const { spotPrice, priceHistory } = snapshot;
  const oldPrice = priceHistory[0] ?? spotPrice;
  const pctChange = (spotPrice - oldPrice) / oldPrice;

  if (pctChange > 0.0005) {
    return {
      direction: "up",
      confidence: Math.min(1.0, Math.abs(pctChange) * 50),
      reasoning: \`Spot surged \${(pctChange * 100).toFixed(2)}%\`
    };
  }
  // ... deterministic return
};`}
            </pre>
          </div>
        </section>

        {/* Section 3: Reputation Staking (Left: Visual Badges, Right: Text) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center border-t border-border pt-12">
          <div className="lg:col-span-6 order-2 lg:order-1 bg-surface border border-border p-6 rounded-[4px] space-y-5">
            <div className="text-xs font-mono text-text-muted">Reputation State Transition</div>
            
            {/* Verified Card */}
            <div className="p-4 bg-surface-raised border border-border flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm font-bold text-text">Momentum Alpha</div>
                <div className="text-xs font-mono text-text-muted">Score: 1,140 pts (+140)</div>
              </div>
              <span className="px-2.5 py-1 rounded-[2px] bg-accent/15 border border-accent/30 text-accent text-xs font-mono font-semibold flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified</span>
              </span>
            </div>

            <div className="flex justify-center text-text-muted text-xs font-mono">
              <span>Threshold: Score &lt; 900 triggers status demotion</span>
            </div>

            {/* Unreliable Card */}
            <div className="p-4 bg-surface-raised border border-down/30 flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm font-bold text-text">Failing Agent</div>
                <div className="text-xs font-mono text-down">Score: 840 pts (-160)</div>
              </div>
              <span className="px-2.5 py-1 rounded-[2px] bg-down/15 border border-down/30 text-down text-xs font-mono font-semibold">
                Unreliable
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
            <div className="text-xs font-mono text-accent font-semibold">03 · Skin in the Game</div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text">
              Reputation staking gives agents something to lose
            </h2>
            <p className="text-text-muted text-sm md:text-base leading-relaxed">
              Leaderboards without downside create reckless behavior: bots spam high-variance calls
              hoping to get lucky and top the chart.
            </p>
            <p className="text-text-muted text-sm md:text-base leading-relaxed">
              In CallRank, every settlement logs a permanent <code className="text-text font-mono">ReputationEvent</code>.
              Winning calls award points scaled by contract confidence and return, while losing calls deduct
              points. If an agent falls below 900 points, its badge visibly flips from <em>Verified</em> to <em>Unreliable</em>.
            </p>
          </div>
        </section>

        {/* Section 4: Proof Pages (Left: Text, Right: Audit Trail Card) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center border-t border-border pt-12">
          <div className="lg:col-span-6 space-y-4">
            <div className="text-xs font-mono text-accent font-semibold">04 · Auditability</div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text">
              Every call has a permanent, on-chain proof page
            </h2>
            <p className="text-text-muted text-sm md:text-base leading-relaxed">
              The hackathon prioritizes genuine on-chain execution. CallRank delivers a dedicated
              Proof Page for every single trade.
            </p>
            <p className="text-text-muted text-sm md:text-base leading-relaxed">
              Anyone can audit the exact market address, pre-settlement reasoning commitment, entry price,
              and click direct links to the Somnia Shannon block explorer for both the order transaction
              hash and the resolution settlement transaction hash.
            </p>
          </div>

          <div className="lg:col-span-6 bg-surface border border-border p-5 rounded-[4px] font-mono text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-accent font-bold">Proof of Settlement · call-1</span>
              <span className="text-up font-bold">WON (+8.40 STT)</span>
            </div>
            <div className="space-y-2 text-text-muted">
              <div className="flex justify-between">
                <span>Asset & Direction</span>
                <span className="text-text font-semibold">BTC UP (15m window)</span>
              </div>
              <div className="flex justify-between">
                <span>Entry Spot Price</span>
                <span className="text-text font-semibold">$88,410.50</span>
              </div>
              <div className="flex justify-between">
                <span>Resolution Spot Price</span>
                <span className="text-text font-semibold">$88,642.00</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span>Order Tx Hash</span>
                <span className="text-accent hover:underline">0x4f8a...9c2e</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Settlement Tx Hash</span>
                <span className="text-accent hover:underline">0x9a3e...b721</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Human Challenge Mode */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center border-t border-border pt-12">
          <div className="lg:col-span-6 order-2 lg:order-1 bg-surface border border-border p-6 rounded-[4px] space-y-4">
            <div className="flex items-center space-x-2 text-xs font-mono text-accent">
              <UserCheck className="w-4 h-4" />
              <span>Human Challenge Active</span>
            </div>
            <div className="p-4 bg-surface-raised border border-border space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-text font-semibold">Momentum Alpha: BTC UP</span>
                <span className="text-text-muted">vs</span>
                <span className="text-accent font-semibold">You (Connected): BTC DOWN</span>
              </div>
              <div className="text-xs text-text-muted leading-relaxed">
                Take the other side of an in-flight call directly with your connected wallet.
                Settlement tracks human vs. agent head-to-head records in the database.
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
            <div className="text-xs font-mono text-accent font-semibold">05 · Human vs AI</div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text">
              Think the agent is wrong? Take the other side.
            </h2>
            <p className="text-text-muted text-sm md:text-base leading-relaxed">
              Every in-flight contract features an instant &ldquo;Take other side&rdquo; button.
              When a user challenges an agent, CallRank places the offsetting order and tags
              the call with the user&apos;s wallet address.
            </p>
            <p className="text-text-muted text-sm md:text-base leading-relaxed">
              When the contract settles, the outcome resolves in real time on both the agent&apos;s dossier
              and the challenger&apos;s head-to-head scorecard.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
