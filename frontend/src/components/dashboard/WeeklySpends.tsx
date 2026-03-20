"use client";

import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useState } from "react";

type DataItem = {
  day: string;
  amount: number;
};

type Hovered = {
  x: number;
  y: number;
  data: DataItem;
} | null;

type Props = {
  data: DataItem[];
};

const fullDay: Record<string, string> = {
  Sun: "Sunday",
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
};

export default function WeeklySpendingCard({ data }: Props) {
  const [hovered, setHovered] = useState<Hovered>(null);

  // 🔥 Add displayAmount for zero bars
  const chartData = data.map((d) => ({
    ...d,
    displayAmount: d.amount === 0 ? 3 : d.amount,
  }));

  // ranking
  const ranked = [...data]
    .sort((a, b) => b.amount - a.amount)
    .map((item, index) => ({
      ...item,
      rank: index,
    }));

  const getColor = (entry: DataItem): string => {
    // zero → subtle line
    if (entry.amount === 0) return "#84cc16";

    const found = ranked.find(
      (d) => d.day === entry.day && d.amount === entry.amount
    );

    if (!found) return "url(#diagonalPattern)";

    if (found.rank === 0) return "url(#top1)";
    if (found.rank === 1) return "url(#top2)";
    if (found.rank === 2) return "url(#top3)";

    return "url(#diagonalPattern)";
  };

  if (!data || data.length === 0) {
    return (
      <div className="h-36 flex items-center justify-center text-sm text-muted-foreground">
        No data yet
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-2xl border border-white/10 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-xl p-4 pb-0">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-md font-medium text-white">
          Weekly Expenses
        </h2>
      </div>

      {/* Chart */}
      <div className="relative h-36">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            
            {/* 🎨 Patterns + Gradients */}
            <defs>
              {/* default pattern */}
              <pattern
                id="diagonalPattern"
                patternUnits="userSpaceOnUse"
                width="6"
                height="6"
                patternTransform="rotate(45)"
              >
                <rect width="6" height="6" fill="rgba(163,230,53,0.08)" />
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="6"
                  stroke="#a3e635"
                  strokeWidth="1"
                  opacity="0.4"
                />
              </pattern>

              {/* gradients */}
              <linearGradient id="top1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ecfccb" />
                <stop offset="100%" stopColor="#84cc16" />
              </linearGradient>

              <linearGradient id="top2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d9f99d" />
                <stop offset="100%" stopColor="#65a30d" />
              </linearGradient>

              <linearGradient id="top3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#bef264" />
                <stop offset="100%" stopColor="#4d7c0f" />
              </linearGradient>
            </defs>

            {/* X Axis */}
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />

            {/* Bars */}
            <Bar
              dataKey="displayAmount"
              radius={[30, 30, 30, 30]}
              isAnimationActive
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={getColor(entry)}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    filter:
                      hovered?.data.day === entry.day
                        ? "brightness(1.2) drop-shadow(0 0 6px rgba(132,204,22,0.6))"
                        : "none",
                  }}
                  onMouseEnter={(e) => {
                    const bounds = (
                      e.target as SVGElement
                    ).getBoundingClientRect();

                    const parent = (
                      e.currentTarget as SVGElement
                    ).closest("div");

                    if (!parent) return;

                    const parentRect = parent.getBoundingClientRect();

                    setHovered({
                      x:
                        bounds.left -
                        parentRect.left +
                        bounds.width / 2,
                      y: bounds.top - parentRect.top,
                      data: entry,
                    });
                  }}
                  onMouseLeave={() => setHovered(null)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* 🔥 Premium Tooltip */}
        {hovered && (
          <div
            className="absolute z-50 -translate-x-1/2 -translate-y-full pointer-events-none"
            style={{
              left: hovered.x,
              top: hovered.y - 10,
            }}
          >
            <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg text-xs border border-white/10 animate-in fade-in zoom-in-95">
              <p className="font-medium text-neutral-800 dark:text-white">
                {fullDay[hovered.data.day]}
              </p>
              <p className="text-lime-600 font-semibold">
                ₹{hovered.data.amount}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}