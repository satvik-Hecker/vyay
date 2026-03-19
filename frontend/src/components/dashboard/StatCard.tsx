import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpRightIcon,
  ArrowUp01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";

type StatCardProps = {
  title: string;
  value: string;
  change: number;
  highlighted?: boolean;
};

export default function StatCard({
  title,
  value,
  change,
  highlighted,
}: StatCardProps) {
  const isPositive = change >= 0;

  // ✅ Adaptive trend color (fix for highlighted card)
  const trendColor = highlighted
    ? isPositive
      ? "text-green-900"
      : "text-red-900"
    : isPositive
    ? "text-green-400"
    : "text-red-400";

  return (
    <div
      className={`relative rounded-2xl p-5 flex flex-col justify-between transition hover:scale-[1.02] ${
        highlighted
          ? "bg-linear-to-br from-lime-400 via-lime-500 to-emerald-900 text-black shadow-[0_0_30px_rgba(132,204,22,0.4)] hover:shadow-[0_0_50px_rgba(132,204,22,0.6)]"
          : "bg-white/5 border border-white/10 text-white"
      }`}
    >
      {/* ✨ Glow Layer */}
      {highlighted && (
        <div className="absolute inset-0 rounded-2xl bg-lime-400/20  opacity-50 pointer-events-none" />
      )}

      {/* 🔝 Top Row */}
      <div className="flex items-center justify-between">
        <p
          className={`text-md font-medium ${
            highlighted ? "text-black/70" : "text-gray-400"
          }`}
        >
          {title}
        </p>

        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full ${
            highlighted ? "bg-black/10" : "bg-white/10"
          }`}
        >
          <HugeiconsIcon icon={ArrowUpRightIcon} size={16} />
        </div>
      </div>

      {/* 💰 Value */}
      <h2
        className={`text-3xl font-semibold ${
          highlighted ? "text-black" : "text-white"
        }`}
      >
        {value}
      </h2>

      {/* 📈 Bottom (Trend) */}
      <div className="flex items-center gap-2 mt-1">
        <HugeiconsIcon
          icon={isPositive ? ArrowUp01Icon : ArrowDown01Icon}
          size={14}
          className={trendColor}
        />
        <p className={`text-sm font-medium ${trendColor}`}>
          {Math.abs(change)}%
        </p>
        <p
          className={`text-sm ${
            highlighted ? "text-black/80" : "text-gray-400"
          }`}
        >
          from last month
        </p>
      </div>
    </div>
  );
}