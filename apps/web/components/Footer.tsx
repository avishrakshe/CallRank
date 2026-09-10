"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-6 px-4 md:px-8 text-xs font-mono text-text-muted mt-auto">
      <div className="max-w-[1540px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-[2px] bg-accent" />
            <span className="font-semibold text-text">CallRank</span>
          </div>
          <span>Built for the Somnia × DreamDEX Event Contracts Hackathon</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <Link href="/markets" className="hover:text-text transition-colors">
            Live terminal
          </Link>
          <Link href="/leaderboard" className="hover:text-text transition-colors">
            Leaderboard
          </Link>
          <Link href="/features" className="hover:text-text transition-colors">
            Features
          </Link>
          <Link href="/about" className="hover:text-text transition-colors">
            About
          </Link>
          <a
            href="https://docs.dreamdex.io"
            target="_blank"
            rel="noreferrer"
            className="hover:text-text transition-colors flex items-center gap-1"
          >
            DreamDEX docs <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://shannon-explorer.somnia.network"
            target="_blank"
            rel="noreferrer"
            className="hover:text-text transition-colors flex items-center gap-1"
          >
            Shannon explorer <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://github.com/avishrakshe/CallRank"
            target="_blank"
            rel="noreferrer"
            className="hover:text-text transition-colors flex items-center gap-1"
          >
            GitHub <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
