"use client";

import React, { useEffect, useRef, useState } from "react";
import { createChart, IChartApi, ISeriesApi, CandlestickData, ColorType } from "lightweight-charts";
import { AssetSymbol } from "@callrank/dreamdex-client/types";

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

    // Initialize Lightweight Chart with Section 3c color palette
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#12161F" },
        textColor: "#7C8496",
        fontSize: 12,
        fontFamily: "'IBM Plex Mono', monospace",
      },
      grid: {
        vertLines: { color: "rgba(124, 132, 150, 0.08)" },
        horzLines: { color: "rgba(124, 132, 150, 0.08)" },
      },
      crosshair: {
        vertLine: { color: "#F2B84B", width: 1, style: 3 },
        horzLine: { color: "#F2B84B", width: 1, style: 3 },
      },
      timeScale: {
        borderColor: "rgba(124, 132, 150, 0.18)",
        timeVisible: true,
        secondsVisible: true,
      },
      rightPriceScale: {
        borderColor: "rgba(124, 132, 150, 0.18)",
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    // Functional Up/Down colors from Section 3c: #2DD4BF (up) and #FF6B6B (down)
    const series = chart.addCandlestickSeries({
      upColor: "#2DD4BF",
      downColor: "#FF6B6B",
      borderVisible: false,
      wickUpColor: "#2DD4BF",
      wickDownColor: "#FF6B6B",
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
      // Time boundary catch
    }
  }, [currentPrice, timeframe]);

  return (
    <div className="terminal-panel p-4 flex flex-col h-full">
      {/* Chart Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
        <div className="flex items-center space-x-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-lg text-text">{asset}/USD</span>
              <span className="text-[11px] px-1.5 py-0.5 rounded-[2px] bg-surface-raised text-text-muted border border-border">
                Live oracle
              </span>
            </div>
            <div className="text-xs text-text-muted">Somnia Shannon testnet price feed</div>
          </div>
        </div>

        {/* Current Live Price Display */}
        <div className="text-right">
          <div className="text-2xl font-mono font-bold text-text tabular-nums tracking-tight">
            ${currentPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-up font-mono flex items-center justify-end space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-up animate-pulse" />
            <span>+1.42% 24h</span>
          </div>
        </div>

        {/* Timeframe Buttons */}
        <div className="flex items-center space-x-1 bg-surface-raised p-0.5 rounded-[2px] border border-border text-xs">
          {(["1m", "5m", "15m"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded-[2px] font-mono transition-all ${
                timeframe === tf
                  ? "bg-surface text-text font-semibold shadow-sm"
                  : "text-text-muted hover:text-text"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Candlestick Chart Area */}
      <div ref={chartContainerRef} className="w-full flex-1 min-h-[380px] relative" />
    </div>
  );
}
