"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpRightIcon,
  ArrowUp01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";

type StatCardProps = {
  title: string;
  value: string;
  change?: number; 
  subtitle?: string; 
  highlighted?: boolean;
};

export default function StatCard({
  title,
  value,
  change,
  subtitle,
  highlighted,
}: StatCardProps) {
  
  const isPositive = change !== undefined && change >= 0;

  const trendColor = highlighted
    ? isPositive
      ? "text-green-900"
      : "text-red-900"
    : isPositive
    ? "text-green-400"
    : "text-red-400";

  return (
    <div
      className={`
        relative rounded-2xl 
        p-4 sm:p-5 
        flex flex-col justify-between 
        min-h-32.5 sm:min-h-37.5
        transition-all duration-200
        hover:scale-[1.02] sm:hover:scale-[1.03]
        ${
          highlighted
            ? "bg-linear-to-br from-lime-400 via-lime-500 to-emerald-900 text-black shadow-[0_0_25px_rgba(132,204,22,0.35)] sm:shadow-[0_0_35px_rgba(132,204,22,0.45)]"
            : "bg-zinc-900 border border-white/10 text-white backdrop-blur-sm"
        }
      `}
    >
      {/* Glow */}
      {highlighted && (
        <div className="absolute inset-0 rounded-2xl bg-lime-400/20 opacity-40 pointer-events-none" />
      )}

      {/* Top Row */}
      <div className="flex items-start justify-between gap-2">
        <p
          className={`
            text-xs sm:text-sm font-medium leading-tight
            ${highlighted ? "text-black/70" : "text-gray-400"}
          `}
        >
          {title}
        </p>

        <div
          className={`
            shrink-0
            w-7 h-7 sm:w-8 sm:h-8
            flex items-center justify-center 
            rounded-full
            ${highlighted ? "bg-black/10" : "bg-white/10"}
          `}
        >
          <HugeiconsIcon icon={ArrowUpRightIcon} size={14} />
        </div>
      </div>

      {/* Value */}
      <h2
        className={`
          font-semibold tracking-tight
          text-xl sm:text-2xl lg:text-3xl 
          ${highlighted ? "text-black" : "text-white"}
        `}
      >
        {value}
      </h2>

      {/* Bottom (Only render if we pass a change OR a subtitle) */}
      {(change !== undefined || subtitle) && (
        <div className="flex items-center gap-1.5 sm:gap-2 ">
          {change !== undefined && (
            <>
              <HugeiconsIcon
                icon={isPositive ? ArrowUp01Icon : ArrowDown01Icon}
                size={12}
                className={trendColor}
              />
              <p className={`text-xs sm:text-sm font-medium ${trendColor}`}>
                {Math.abs(change)}%
              </p>
            </>
          )}

          {subtitle && (
            <p
              className={`
                text-base sm:text-sm
                ${highlighted ? "text-black/80" : "text-gray-400"}
              `}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}