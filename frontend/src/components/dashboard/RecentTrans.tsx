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
    <div className="rounded-2xl border border-white/10 bg-white/70 dark:bg-neutral-900/60 p-5">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Recent Transactions
        </h2>

        <button className="p-1.5 rounded-full border border-zinc-800 bg-lime-500 text-black hover:bg-lime-600 transition">
          <Plus size={16} />
        </button>
      </div>

      {/* Transactions */}
      <div className="space-y-4">
        {transactions.length === 0 ? (
          <p className="text-sm text-zinc-500">
            No transactions yet
          </p>
        ) : (
          transactions.map((tx) => {
            const isIncome = tx.type === "income";

            return (
              <div
                key={tx._id}
                className="flex items-center justify-between"
              >
                {/* Left */}
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
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
                      size={18}
                    />
                  </div>

                  <p className="font-medium text-zinc-900 dark:text-white">
                    {tx.category}
                  </p>
                </div>

                {/* Right */}
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      isIncome
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {isIncome ? "+" : "-"}₹{tx.amount}
                  </p>

                  <p className="text-xs text-zinc-500">
                    {formatTime(tx.transactionDate)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 text-center">
        <button className="text-sm text-blue-600 hover:underline">
          View All →
        </button>
      </div>
    </div>
  );
}