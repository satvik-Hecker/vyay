"use client";

import { useEffect, useState } from "react";
import StatCard from "./StatCard";
import WeeklySpendingCard from "./WeeklySpends";
import RecentTransactionsCard from "./RecentTrans";

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
  weeklySpending: {
    date: string;
    amount: number;
  }[];
  recentTransactions: {
    _id: string;
    category: string;
    amount: number;
    type: "income" | "expense";
    transactionDate: string;
  }[];
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

        if (!res.ok) throw new Error("Failed");

        const json: DashboardResponse = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="flex-1 p-6 text-white">Loading...</div>;
  }

  if (!data) {
    return <div className="flex-1 p-6 text-red-400">Error loading</div>;
  }

  const formattedWeeklyData =
    data.weeklySpending.map((item) => ({
      day: new Date(item.date).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      amount: item.amount,
    })) || [];

  return (
    <div className="flex-1 font-sans overflow-hidden">
      {/* 🔥 SINGLE WRAPPER */}
      <div className="h-full overflow-y-auto">
        <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 space-y-6">

          {/* 🧭 Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-white">
                Dashboard
              </h1>
              <p className="text-sm text-gray-400">
                Track, manage and analyze your finances effortlessly.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button className="w-full sm:w-auto px-4 py-2 rounded-lg bg-lime-400 text-black font-medium hover:opacity-90 transition">
                + Add Transaction
              </button>

              <button className="w-full sm:w-auto px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition">
                Export
              </button>
            </div>
          </div>

          {/* 🔢 Stats */}
          <div className="grid 
            grid-cols-2 
            sm:grid-cols-2 
            lg:grid-cols-4  
            gap-3 sm:gap-4">
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

          {/* 📊 Weekly + Transactions (NO WRAPPERS) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Weekly (2 cols) */}
            <div className="lg:col-span-2">
              <WeeklySpendingCard data={formattedWeeklyData} />
            </div>

            {/* Recent (1 col) */}
            <div className="lg:col-span-1">
              <RecentTransactionsCard
                transactions={data.recentTransactions || []}
              />
            </div>
          </div>

          {/* 🔔 Reminders */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-white font-medium mb-2">Reminders</h3>
              <p className="text-sm text-gray-400">
                No upcoming reminders
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}