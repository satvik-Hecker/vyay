"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  MoneyBag02Icon,
  Invoice03Icon,
} from "@hugeicons/core-free-icons";
import AddTransactionModal from "../AddTransactionModal";
import Link from "next/link";

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
  const [open, setOpen] = useState(false);

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
    <div className="h-full flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl p-5">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-white">
          Recent Transactions
        </h2>

        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg bg-lime-400 text-black hover:bg-lime-300 active:scale-95 transition"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-thin">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-sm text-zinc-500">
              No transactions yet
            </p>
            <p className="text-xs text-zinc-600 mt-1">
              Start by adding your first one
            </p>
          </div>
        ) : (
          transactions.map((tx) => {
            const isIncome = tx.type === "income";

            return (
              <div
                key={tx._id}
                className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-zinc-800/60 transition"
              >
                {/* Left */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      isIncome
                        ? "bg-lime-400/10 text-lime-400"
                        : "bg-red-400/10 text-red-400"
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

                  <p className="font-medium text-sm text-zinc-200 truncate">
                    {tx.category}
                  </p>
                </div>

                {/* Right */}
                <div className="text-right shrink-0">
                  <p
                    className={`font-semibold text-sm ${
                      isIncome
                        ? "text-lime-400"
                        : "text-red-400"
                    }`}
                  >
                    {isIncome ? "+" : "-"}₹{tx.amount}
                  </p>

                  <p className="text-[11px] text-zinc-500">
                    {formatTime(tx.transactionDate)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <Link href="/transactions">
        <button className="mt-4 w-full text-sm text-zinc-400 hover:text-lime-400 transition">
          View All →
        </button>
      </Link>

      {/* Modal */}
      <AddTransactionModal
        open={open}
        setOpen={setOpen}
        onSuccess={() => {
          // optional: refetch or handle outside
        }}
      />
    </div>
  );
}