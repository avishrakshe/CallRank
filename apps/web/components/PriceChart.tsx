"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  LineData,
  ColorType,
} from "lightweight-charts";
import { AssetSymbol } from "@callrank/dreamdex-client/types";
import { TrendingUp, BarChart2, LineChart, Sparkles } from "lucide-react";

interface PriceChartProps {
  asset: AssetSymbol;
  currentPrice: number;
}

export function PriceChart({ asset, currentPrice }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const lineSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const activeCandleRef = useRef<{
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
  } | null>(null);

  const [timeframe, setTimeframe] = useState<"1m" | "5m" | "15m" | "1h">("1m");
  const [chartType, setChartType] = useState<"candlestick" | "line">("candlestick");

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Dark terminal theme matching CallRank Landing Page & Section 3c
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#12161F" },
        textColor: "#7C8496",
        fontSize: 11,
        fontFamily: "'IBM Plex Mono', monospace",
      },
      grid: {
        vertLines: { color: "rgba(255, 255, 255, 0.04)" },
        horzLines: { color: "rgba(255, 255, 255, 0.04)" },
      },
      crosshair: {
        vertLine: { color: "#F2B84B", width: 1, style: 3 },
        horzLine: { color: "#F2B84B", width: 1, style: 3 },
      },
      timeScale: {
        borderColor: "#202635",
        timeVisible: true,
        secondsVisible: true,
      },
      rightPriceScale: {
        borderColor: "#202635",
        autoScale: true,
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      width: chartContainerRef.current.clientWidth,
      height: 380,
    });

    const nowSec = Math.floor(Date.now() / 1000);
    const step =
      timeframe === "1m"
        ? 60
        : timeframe === "5m"
        ? 300
        : timeframe === "15m"
        ? 900
        : 3600;
    const volatility = asset === "BTC" ? 22 : 3.0;

    // Generate historical candles ending precisely at currentPrice to prevent price/header drift
    const candleData: CandlestickData[] = [];
    const lineData: LineData[] = [];

    // Work backwards from currentPrice to ensure zero gap
    const prices: number[] = [currentPrice];
    for (let i = 1; i <= 45; i++) {
      const prev = prices[0] - (Math.random() - 0.49) * volatility;
      prices.unshift(+prev.toFixed(2));
    }

    for (let i = 0; i < 45; i++) {
      const time = (nowSec - (45 - i) * step) as any;
      const open = prices[i];
      const close = prices[i + 1] ?? open;
      const high = +(Math.max(open, close) + Math.random() * (volatility * 0.35)).toFixed(2);
      const low = +(Math.min(open, close) - Math.random() * (volatility * 0.35)).toFixed(2);

      candleData.push({ time, open, high, low, close });
      lineData.push({ time, value: close });
    }

    // Set current active candle reference
    const latestBar = candleData[candleData.length - 1];
    if (latestBar) {
      activeCandleRef.current = {
        time: latestBar.time as number,
        open: latestBar.open,
        high: latestBar.high,
        low: latestBar.low,
        close: latestBar.close,
      };
    }

    if (chartType === "candlestick") {
      const candleSeries = chart.addCandlestickSeries({
        upColor: "#2DD4BF",
        downColor: "#FF6B6B",
        borderVisible: false,
        wickUpColor: "#2DD4BF",
        wickDownColor: "#FF6B6B",
      });
      candleSeries.setData(candleData);
      candleSeriesRef.current = candleSeries;
      lineSeriesRef.current = null;
    } else {
      const lineSeries = chart.addLineSeries({
        color: "#2DD4BF",
        lineWidth: 2,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 4,
        crosshairMarkerBorderColor: "#F2B84B",
        crosshairMarkerBackgroundColor: "#12161F",
      });
      lineSeries.setData(lineData);
      lineSeriesRef.current = lineSeries;
      candleSeriesRef.current = null;
    }

    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [asset, timeframe, chartType]);

  // Unified single-source-of-truth live candle updates
  useEffect(() => {
    const nowSec = Math.floor(Date.now() / 1000);
    const step =
      timeframe === "1m"
        ? 60
        : timeframe === "5m"
        ? 300
        : timeframe === "15m"
        ? 900
        : 3600;
    const currentBarTime = (nowSec - (nowSec % step)) as any;

    try {
      if (activeCandleRef.current) {
        if (activeCandleRef.current.time === currentBarTime) {
          activeCandleRef.current.high = Math.max(activeCandleRef.current.high, currentPrice);
          activeCandleRef.current.low = Math.min(activeCandleRef.current.low, currentPrice);
          activeCandleRef.current.close = currentPrice;
        } else {
          // New candle period started
          activeCandleRef.current = {
            time: currentBarTime,
            open: currentPrice,
            high: currentPrice,
            low: currentPrice,
            close: currentPrice,
          };
        }
      }

      if (candleSeriesRef.current && activeCandleRef.current) {
        candleSeriesRef.current.update({
          time: activeCandleRef.current.time as any,
          open: activeCandleRef.current.open,
          high: activeCandleRef.current.high,
          low: activeCandleRef.current.low,
          close: activeCandleRef.current.close,
        });
      } else if (lineSeriesRef.current) {
        lineSeriesRef.current.update({
          time: currentBarTime,
          value: currentPrice,
        });
      }
    } catch {
      // Time boundary sync
    }
  }, [currentPrice, timeframe]);

  return (
    <div className="bg-surface border border-border p-4 sm:p-5 rounded-[4px] flex flex-col h-full text-text space-y-4">
      {/* Chart Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border">
        {/* Asset Info & Oracle Badge */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-[2px] bg-surface-raised border border-border flex items-center justify-center text-accent">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base md:text-lg font-mono tracking-tight text-text">
                {asset}/USD Spot Feed
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-[2px] bg-up/10 text-up font-mono font-semibold border border-up/25 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-up animate-pulse" />
                <span>Live Oracle</span>
              </span>
            </div>
            <div className="text-xs text-text-muted font-mono">
              DreamDEX Fixed-Window Reference Price
            </div>
          </div>
        </div>

        {/* Price Readout, Timeframe & Type Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="text-left sm:text-right font-mono">
            <div className="text-xl md:text-2xl font-bold text-text tabular-nums tracking-tight">
              ${currentPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-up font-semibold flex items-center sm:justify-end space-x-1">
              <span>+1.42% 24h</span>
            </div>
          </div>

          {/* Timeframe Selectors */}
          <div className="flex items-center space-x-1 bg-surface-raised p-1 rounded-[2px] border border-border text-xs font-mono">
            {(["1m", "5m", "15m", "1h"] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded-[2px] transition-colors ${
                  timeframe === tf
                    ? "bg-surface text-accent font-bold border border-accent/40"
                    : "text-text-muted hover:text-text"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Type Toggle: Candles vs Line */}
          <div className="flex items-center space-x-1 bg-surface-raised p-1 rounded-[2px] border border-border text-xs font-mono">
            <button
              onClick={() => setChartType("candlestick")}
              title="Candlestick Chart"
              className={`p-1.5 rounded-[2px] transition-colors ${
                chartType === "candlestick"
                  ? "bg-surface text-accent border border-accent/40"
                  : "text-text-muted hover:text-text"
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartType("line")}
              title="Line Chart"
              className={`p-1.5 rounded-[2px] transition-colors ${
                chartType === "line"
                  ? "bg-surface text-accent border border-accent/40"
                  : "text-text-muted hover:text-text"
              }`}
            >
              <LineChart className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div
        ref={chartContainerRef}
        className="w-full flex-1 min-h-[380px] relative rounded-[2px] overflow-hidden"
      />

      {/* Chart Sub-Bar / Footnote */}
      <div className="flex items-center justify-between text-[11px] font-mono text-text-muted pt-1 border-t border-border">
        <span>TradingView Lightweight-Charts · Single Source of Truth</span>
        <span className="text-accent flex items-center space-x-1">
          <Sparkles className="w-3 h-3" />
          <span>Somnia Shannon Testnet (50312)</span>
        </span>
      </div>
    </div>
  );
}
