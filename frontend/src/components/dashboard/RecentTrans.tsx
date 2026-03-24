"use client";

import { Plus } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  MoneyBag02Icon,
  Invoice03Icon,
} from "@hugeicons/core-free-icons";

type Transaction = {
  _id: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  transactionDate: string;
};

export default function RecentTransactionsCard({
  transactions,
}: {
  transactions: Transaction[];
}) {
  function formatTime(date: string) {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "—";

    const now = new Date();

    const diff = Math.floor(
      (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
    );

    const time = d.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });

    if (diff === 0) return `Today • ${time}`;
    if (diff === 1) return "Yesterday";

    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  }

  return (
    <div className="h-full flex flex-col bg-white/5 border border-white/10 rounded-xl p-5">

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-white">
          Recent Transactions
        </h2>

        <button className="p-2 rounded-full border border-zinc-800 bg-lime-500 text-black hover:bg-lime-600 active:scale-95 transition">
          <Plus size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 sm:space-y-4 scrollbar-thin">

        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-sm text-zinc-500">
              No transactions yet
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              Start by adding your first one
            </p>
          </div>
        ) : (
          transactions.map((tx) => {
            const isIncome = tx.type === "income";

            return (
              <div
                key={tx._id}
                className="flex items-center justify-between gap-3 hover:bg-black/5  p-0.5 rounded-lg transition"
              >
                {/* Left */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-full shrink-0 ${
                      isIncome
                        ? "bg-green-200/70 text-green-800"
                        : "bg-red-200/70 text-red-800"
                    }`}
                  >
                    <HugeiconsIcon
                      icon={
                        (isIncome
                          ? MoneyBag02Icon
                          : Invoice03Icon) as IconSvgElement
                      }
                      size={16}
                    />
                  </div>

                  <p className="font-medium text-sm sm:text-base text-zinc-900 dark:text-white truncate">
                    {tx.category}
                  </p>
                </div>

                {/* Right */}
                <div className="text-right shrink-0">
                  <p
                    className={`font-semibold text-sm sm:text-base ${
                      isIncome
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {isIncome ? "+" : "-"}₹{tx.amount}
                  </p>

                  <p className="text-[11px] sm:text-xs text-zinc-500">
                    {formatTime(tx.transactionDate)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
        <button className="w-full text-sm font-medium text-blue-600 hover:underline">
          View All →
        </button>
    </div>
  );
}