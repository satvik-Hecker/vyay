"use client";

import { useEffect, useState } from "react";
import StatCard from "./StatCard";

type DashboardResponse = {
  stats: {
    totalBalance: number;
    income: number;
    expense: number;
    transactions: number;
    changes: {
      balance: number;
      income: number;
      expense: number;
      transactions: number;
    };
  };
};

export default function DashboardMain() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

 const formatCurrency = (num: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("http://localhost:5000/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch dashboard");

        const json: DashboardResponse = await res.json();
        setData(json);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 p-6 text-white font-sans">
        Loading dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex-1 p-6 text-red-400 font-sans">
        Failed to load dashboard
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-hidden">
      <div className="h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-y-auto font-sans">

        <div className="space-y-6">

          {/* 🧭 Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">
                Dashboard
              </h1>
              <p className="text-sm text-gray-400">
                Track, manage and analyze your finances effortlessly.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-lg bg-white text-black font-medium hover:opacity-90 transition">
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
              value={formatCurrency(data.stats.totalBalance)}
              change={data.stats.changes.balance}
              highlighted
            />

            <StatCard
              title="Monthly Income"
              value={formatCurrency(data.stats.income)}
              change={data.stats.changes.income}
            />

            <StatCard
              title="Monthly Expense"
              value={formatCurrency(data.stats.expense)}
              change={data.stats.changes.expense}
            />

            <StatCard
              title="Transactions"
              value={data.stats.transactions.toString()}
              change={data.stats.changes.transactions}
            />
          </div>

          {/* 📊 Middle Section */}
          <div className="grid grid-cols-3 gap-6">

            <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-white font-medium mb-4">
                Analytics
              </h3>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-white font-medium mb-4">
                Reminders
              </h3>
            </div>

          </div>

          {/* 📦 Bottom Section */}
          <div className="grid grid-cols-3 gap-6">

            <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-white font-medium mb-4">
                Recent Transactions
              </h3>
            </div>

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