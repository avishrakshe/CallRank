"use client";

import React, { useEffect, useRef, useState } from "react";
import { createChart, IChartApi, ISeriesApi, CandlestickData, ColorType } from "lightweight-charts";
import { AssetSymbol } from "@callrank/dreamdex-client/types";
import { Maximize2, TrendingUp, RefreshCw } from "lucide-react";

interface PriceChartProps {
  asset: AssetSymbol;
  currentPrice: number;
}

export function PriceChart({ asset, currentPrice }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const [timeframe, setTimeframe] = useState<"1m" | "5m" | "15m">("1m");

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Initialize Lightweight Chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#94a3b8",
        fontSize: 12,
      },
      grid: {
        vertLines: { color: "rgba(30, 44, 77, 0.4)" },
        horzLines: { color: "rgba(30, 44, 77, 0.4)" },
      },
      crosshair: {
        vertLine: { color: "#6366f1", width: 1, style: 3 },
        horzLine: { color: "#6366f1", width: 1, style: 3 },
      },
      timeScale: {
        borderColor: "rgba(30, 44, 77, 0.8)",
        timeVisible: true,
        secondsVisible: true,
      },
      rightPriceScale: {
        borderColor: "rgba(30, 44, 77, 0.8)",
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      width: chartContainerRef.current.clientWidth,
      height: 380,
    });

    const series = chart.addCandlestickSeries({
      upColor: "#10b981",
      downColor: "#f43f5e",
      borderVisible: false,
      wickUpColor: "#10b981",
      wickDownColor: "#f43f5e",
    });

    // Generate initial realistic candle history (last 40 candles)
    const nowSec = Math.floor(Date.now() / 1000);
    const step = timeframe === "1m" ? 60 : timeframe === "5m" ? 300 : 900;
    const basePrice = asset === "BTC" ? 88400 : 3120;
    const volatility = asset === "BTC" ? 25 : 3.5;

    const initialData: CandlestickData[] = [];
    let prevClose = basePrice - 40 * 2;

    for (let i = 40; i >= 1; i--) {
      const time = (nowSec - i * step) as any;
      const open = prevClose;
      const change = (Math.random() - 0.48) * volatility;
      const close = +(open + change).toFixed(2);
      const high = +(Math.max(open, close) + Math.random() * (volatility * 0.5)).toFixed(2);
      const low = +(Math.min(open, close) - Math.random() * (volatility * 0.5)).toFixed(2);

      initialData.push({ time, open, high, low, close });
      prevClose = close;
    }

    series.setData(initialData);

    chartRef.current = chart;
    seriesRef.current = series;

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
  }, [asset, timeframe]);

  // Update current live candle on price tick
  useEffect(() => {
    if (!seriesRef.current) return;
    const nowSec = Math.floor(Date.now() / 1000);
    const step = timeframe === "1m" ? 60 : 300;
    const candleTime = (nowSec - (nowSec % step)) as any;

    try {
      seriesRef.current.update({
        time: candleTime,
        open: currentPrice,
        high: +(currentPrice + Math.random() * 2).toFixed(2),
        low: -(currentPrice - Math.random() * 2).toFixed(2),
        close: currentPrice,
      });
    } catch {
      // time boundary catch
    }
  }, [currentPrice, timeframe]);

  return (
    <div className="glass-panel rounded-xl p-4 flex flex-col h-full border border-border">
      {/* Chart Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/70 mb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-white">{asset}/USD</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                LIVE ORACLE
              </span>
            </div>
            <div className="text-xs text-slate-400">Somnia Shannon Testnet Price Feed</div>
          </div>
        </div>

        {/* Current Live Price Display */}
        <div className="text-right">
          <div className="text-2xl font-mono font-extrabold text-white tracking-tight">
            ${currentPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-emerald-400 flex items-center justify-end space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>+1.42% 24h</span>
          </div>
        </div>

        {/* Timeframe Buttons */}
        <div className="flex items-center space-x-1 bg-surface-raised p-1 rounded-lg border border-border text-xs">
          {(["1m", "5m", "15m"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                timeframe === tf
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Candlestick Chart Area */}
      <div ref={chartContainerRef} className="w-full flex-1 min-h-[360px] relative" />
    </div>
  );
}
