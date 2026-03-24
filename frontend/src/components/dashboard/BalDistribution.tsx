"use client";

import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Wallet01Icon,
  BankIcon,
} from "@hugeicons/core-free-icons";

type Props = {
  cash: number;
  bank: number;
};

export default function CashBalanceCard({ cash, bank }: Props) {
  const total = cash + bank || 1;

  const cashPercent = Math.round((cash / total) * 100);
  const bankPercent = 100 - cashPercent;

  // 🔥 MOCK monthly trend (replace later with real data)
  const monthlyChange = 5200;
  const isPositive = monthlyChange >= 0;

  // 🔥 Risk logic
  let risk = "Balanced";
  let riskColor = "text-yellow-400";
  if (cashPercent > 60) {
    risk = "High Cash";
    riskColor = "text-red-400";
  } else if (bankPercent > 70) {
    risk = "Safe";
    riskColor = "text-green-400";
  }

  // 🔥 SVG setup
  const cx = 150;
  const cy = 130;
  const r = 95;
  const strokeWidth = 26;
  const totalAngle = 180;
  const epsilon = 0.5;

  const cashAngle = (cashPercent / 100) * totalAngle;
  const bankAngle = (bankPercent / 100) * totalAngle + epsilon;

  const polarToCartesian = (angle: number) => {
    const rad = ((180 - angle) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy - r * Math.sin(rad),
    };
  };

  const arcPath = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(startAngle);
    const end = polarToCartesian(endAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  };

  const cashEnd = cashAngle;
  const bankStart = cashEnd;
  const bankEnd = bankStart + bankAngle;

  // 🔥 Sparkline dummy data
  const spark = [10, 20, 15, 30, 25, 40, 35];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full flex flex-col bg-white/5 border border-white/10 rounded-xl p-5"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white font-medium text-sm sm:text-base">
          Balance Distribution
        </h3>

        <span className={`text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 ${riskColor}`}>
          {risk}
        </span>
      </div>

      {/* 🔥 Chart */}
      <div className="flex justify-center">
        <svg viewBox="0 0 300 180" className="w-full max-w-70">
          {/* Background */}
          <path
            d={arcPath(0, 180)}
            fill="none"
            stroke="#27272a"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Bank */}
          <motion.path
            d={arcPath(bankStart, bankEnd)}
            fill="none"
            stroke="#3f6212"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8 }}
          />

          {/* Cash */}
          <motion.path
            d={arcPath(0, cashEnd)}
            fill="none"
            stroke="#84cc16"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />

          {/* Center */}
          <text
            x={cx}
            y={cy - 8}
            textAnchor="middle"
            className="fill-white text-[22px] font-semibold"
          >
            ₹{total.toLocaleString()}
          </text>
          <text
            x={cx}
            y={cy + 14}
            textAnchor="middle"
            className="fill-zinc-400 text-xs"
          >
            Total Balance
          </text>
        </svg>
      </div>

      {/* 🔥 Breakdown */}
      <div className="flex justify-between text-sm mb-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-zinc-400 text-md">
            <HugeiconsIcon icon={Wallet01Icon} size={16} />
            Cash
          </div>
          <p className="text-white font-semibold">
            ₹{cash.toLocaleString()}
          </p>
         
        </div>

        <div className="text-right gap-2 flex flex-col">
          <div className="flex items-center gap-2 justify-end text-zinc-400 text-md">
            <HugeiconsIcon icon={BankIcon} size={16} />
            Bank
          </div>
          <p className="text-white font-semibold">
            ₹{bank.toLocaleString()}
          </p>
        </div>
      </div>

      {/* 🔥 Insights */}
      <div className="border-t border-zinc-700 pt-3 flex flex-col gap-3">

        <p className="text-sm text-zinc-400">
          {bankPercent > 70
            ? "👍 Most funds safely in bank"
            : cashPercent > 60
            ? "⚠️ High cash usage detected"
            : "⚖️ Healthy balance distribution"}
        </p>

        {/* Secondary */}
        <div className="flex justify-between text-sm text-zinc-500">
          <span>Cash: <span className="text-white">{cashPercent}%</span></span>
          <span>Bank: <span className="text-white">{bankPercent}%</span></span>
        </div>

        {/* 🔥 Trend + Sparkline */}
        <div className="flex justify-between items-center mt-1">

          <p className={`text-sm font-medium ${isPositive ? "text-green-400" : "text-red-400"}`}>
            {isPositive ? "↑" : "↓"} ₹{Math.abs(monthlyChange).toLocaleString()} this month
          </p>

          {/* Sparkline */}
          <svg width="80" height="30">
            <polyline
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              points={spark
                .map((v, i) => `${i * 12},${30 - v / 2}`)
                .join(" ")}
            />
          </svg>

        </div>
      </div>
    </motion.div>
  );
}