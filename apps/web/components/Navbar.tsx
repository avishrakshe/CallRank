"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, Zap } from "lucide-react";
import { ConnectWallet } from "./ConnectWallet";
import { AudioCuesToggle } from "./AudioCuesToggle";

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/markets", label: "Markets" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/features", label: "Features" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="border-b border-border bg-surface sticky top-0 z-50 px-4 md:px-8 py-2.5 flex items-center justify-between">
      {/* Brand Logo & Tag */}
      <div className="flex items-center space-x-6">
        <Link href="/" className="flex items-center space-x-2.5 group">
          <span className="w-3 h-3 rounded-[2px] bg-accent group-hover:scale-105 transition-transform" />
          <div className="flex items-baseline space-x-2">
            <span className="font-bold text-base tracking-tight text-text">CallRank</span>
            <span className="hidden sm:inline text-xs text-text-muted">Somnia × DreamDEX</span>
          </div>
        </Link>

        {/* Primary Nav Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1 rounded-[2px] text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-surface-raised text-text font-semibold border border-border"
                    : "text-text-muted hover:text-text"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Network Indicator, Audio Toggle & Real ConnectWallet Component */}
      <div className="flex items-center space-x-3">
        <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded-[2px] bg-surface-raised border border-border text-xs font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-up animate-pulse" />
          <span className="text-text-muted">Shannon 50312</span>
        </div>

        <AudioCuesToggle />

        <ConnectWallet />
      </div>
    </header>
  );
}
