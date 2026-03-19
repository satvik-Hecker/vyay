"use client";
import StatCard from "./StatCard";

export default function DashboardMain() {
  return (
    <div className="flex-1  overflow-hidden">
      <div className="h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-y-auto font-sans">

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white">
                Dashboard
              </h1>
              <p className="text-sm text-gray-400">
                Track, manage and analyze your finances effortlessly.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-lg bg-lime-500 text-black font-medium hover:opacity-80 transition">
                + Add Transaction
              </button>

              <button className="px-4 py-2 rounded-lg border border-white/20 text-white font-medium hover:bg-white/10 transition">
                Export Data
              </button>

            </div>
          </div>

          {/* 🔢 Stats */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard
                title="Total Balance"
                value="₹24,500"
                change={8}
                highlighted
            />

            <StatCard
                title="Monthly Income"
                value="₹40,000"
                change={5}
            />

            <StatCard
                title="Monthly Expense"
                value="₹18,200"
                change={-2}
            />

            <StatCard
                title="Transactions"
                value="128"
                change={12}
            />
            </div>

          {/* 📊 Middle Section */}
          <div className="grid grid-cols-3 gap-6">

            {/* Analytics */}
            <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-white font-medium mb-4">
                Analytics
              </h3>
            </div>

            {/* Reminders */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-white font-medium mb-4">
                Reminders
              </h3>
            </div>

          </div>

          {/* 📦 Bottom Section */}
          <div className="grid grid-cols-3 gap-6">

            {/* Transactions / Team */}
            <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-white font-medium mb-4">
                Recent Transactions
              </h3>
            </div>

            {/* Progress */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-white font-medium mb-4">
                Progress
              </h3>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}