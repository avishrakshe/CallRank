"use client";

import React, { useEffect, useRef, useState } from "react";
import { createChart, IChartApi, ISeriesApi, CandlestickData, ColorType } from "lightweight-charts";
import { AssetSymbol } from "@callrank/dreamdex-client/types";
import { TrendingUp } from "lucide-react";

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

    // Clean modern chart matching Finnova aesthetic
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#FFFFFF" },
        textColor: "#6B7280",
        fontSize: 12,
        fontFamily: "'IBM Plex Mono', monospace",
      },
      grid: {
        vertLines: { color: "#F3F4F6" },
        horzLines: { color: "#F3F4F6" },
      },
      crosshair: {
        vertLine: { color: "#4B49E9", width: 1, style: 3 },
        horzLine: { color: "#4B49E9", width: 1, style: 3 },
      },
      timeScale: {
        borderColor: "#E5E7EB",
        timeVisible: true,
        secondsVisible: true,
      },
      rightPriceScale: {
        borderColor: "#E5E7EB",
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      width: chartContainerRef.current.clientWidth,
      height: 340,
    });

    const series = chart.addCandlestickSeries({
      upColor: "#10B981",
      downColor: "#EF4444",
      borderVisible: false,
      wickUpColor: "#10B981",
      wickDownColor: "#EF4444",
    });

    const nowSec = Math.floor(Date.now() / 1000);
    const step = timeframe === "1m" ? 60 : timeframe === "5m" ? 300 : 900;
    const basePrice = asset === "BTC" ? 88400 : 3120;
    const volatility = asset === "BTC" ? 22 : 3.2;

    const initialData: CandlestickData[] = [];
    let prevClose = basePrice - 40 * 1.5;

    for (let i = 40; i >= 1; i--) {
      const time = (nowSec - i * step) as any;
      const open = prevClose;
      const change = (Math.random() - 0.48) * volatility;
      const close = +(open + change).toFixed(2);
      const high = +(Math.max(open, close) + Math.random() * (volatility * 0.4)).toFixed(2);
      const low = +(Math.min(open, close) - Math.random() * (volatility * 0.4)).toFixed(2);

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

  // Update live candle on price tick
  useEffect(() => {
    if (!seriesRef.current) return;
    const nowSec = Math.floor(Date.now() / 1000);
    const step = timeframe === "1m" ? 60 : 300;
    const candleTime = (nowSec - (nowSec % step)) as any;

    try {
      seriesRef.current.update({
        time: candleTime,
        open: currentPrice,
        high: +(currentPrice + Math.random() * 1.5).toFixed(2),
        low: +(currentPrice - Math.random() * 1.5).toFixed(2),
        close: currentPrice,
      });
    } catch {
      // Time boundary
    }
  }, [currentPrice, timeframe]);

  return (
    <div className="finnova-card p-5 flex flex-col h-full">
      {/* Chart Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-gray-900">{asset}/USD Spot Feed</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-medium border border-emerald-200">
                Live Oracle
              </span>
            </div>
            <div className="text-xs text-gray-500">DreamDEX Fixed-Window Reference Price</div>
          </div>
        </div>

        {/* Current Live Price Display */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-gray-900 tabular-nums tracking-tight">
              ${currentPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-emerald-600 font-mono font-medium flex items-center justify-end space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>+1.42% 24h</span>
            </div>
          </div>

          {/* Timeframe Buttons */}
          <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-xl text-xs font-medium">
            {(["1m", "5m", "15m"] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  timeframe === tf
                    ? "bg-white text-gray-900 font-semibold shadow-subtle"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Candlestick Chart Area */}
      <div ref={chartContainerRef} className="w-full flex-1 min-h-[340px] relative" />
    </div>
  );
}
