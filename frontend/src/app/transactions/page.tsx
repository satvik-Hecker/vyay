"use client";


import DashboardWrapper from "@/components/layout/DashboardWrapper";

export default function TransactionsPage() {
 

  return (
    <DashboardWrapper>
      <div className="flex-1 rounded-2xl backdrop-blur-xl font-sans border border-white/5 px-4 sm:px-6 lg:px-8 py-6 space-y-6 bg-zinc-900/95 min-h-screen">

      {/* 🧭 Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white">
            Transactions
          </h1>
          <p className="text-sm text-gray-400">
            Track, manage and analyze your finances.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button className="px-4 py-2 rounded-lg bg-lime-400 text-black font-medium hover:opacity-90 transition">
            + Add Transaction
          </button>

          <button className="px-4 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition">
            Export
          </button>
        </div>
      </div>
      </div>
    </DashboardWrapper>
  );
}