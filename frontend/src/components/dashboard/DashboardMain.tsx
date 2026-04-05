"use client";

import { useEffect, useState } from "react";
import StatCard from "./StatCard";
import WeeklySpendingCard from "./WeeklySpends";
import RecentTransactionsCard from "./RecentTrans";
import CashBalanceCard from "./BalDistribution";
import { CloudSync } from "lucide-react";



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
  cashVsBalance: {
    cash: number;
    bank: number;
  };
};



export default function DashboardMain() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  

  const formatCurrency = (num: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num);

    const fetchDashboard = async (isRefresh = false) => {
  try {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

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
    if (isRefresh) {
      setRefreshing(false);
    } else {
      setLoading(false);
    }
  }
};

  useEffect(() => {
    fetchDashboard(false);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 p-6 text-gray-400">Loading dashboard...</div>
    );
  }

  if (!data) {
    return (
      <div className="flex-1 p-6 text-red-400">Error loading</div>
    );
  }

  const formattedWeeklyData = data.weeklySpending.map((item) => ({
    day: new Date(item.date).toLocaleDateString("en-US", {
      weekday: "short",
    }),
    amount: item.amount,
  }));

  return (
    <div className="flex-1 rounded-2xl backdrop-blur-xl font-sans border border-white/5 px-4 sm:px-6 lg:px-8 py-6 space-y-6 bg-zinc-900/95 min-h-screen">

      {/* 🧭 Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white">
            Dashboard
          </h1>
          <p className="text-sm text-gray-400">
            Track, manage and analyze your finances.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={() => fetchDashboard(true)}
            disabled={refreshing}
            className="px-4 py-2 flex gap-2 items-center rounded-lg bg-lime-400 text-black font-medium 
            hover:opacity-90 active:scale-95 transition disabled:opacity-50"
          >
            <CloudSync className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

          <button className="px-4 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition">
            Export
          </button>
        </div>
      </div>

      {/* 🔢 Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Balance"
          value={formatCurrency(data.stats.totalBalance)}
          change={data.stats.changes.balance}
          subtitle="from last month"
          highlighted
        />
        <StatCard
          title="Monthly Income"
          value={formatCurrency(data.stats.income)}
          change={data.stats.changes.income}
          subtitle="from last month"
        />
        <StatCard
          title="Monthly Expense"
          value={formatCurrency(data.stats.expense)}
          change={data.stats.changes.expense}
          subtitle="from last month"
        />
        <StatCard
          title="Transactions"
          value={data.stats.transactions.toString()}
          change={data.stats.changes.transactions}
          subtitle="from last month"
        />
      </div>

      {/* 📊 MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

        {/* Weekly Spending - spans 2 cols on desktop */}
        <div className="lg:col-span-2">
          <WeeklySpendingCard data={formattedWeeklyData} />
        </div>

        {/* Cash Balance */}
        <div className="lg:col-span-1">
          <CashBalanceCard
            cash={data.cashVsBalance.cash}
            bank={data.cashVsBalance.bank}
          />
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-1">
          <RecentTransactionsCard
            transactions={data.recentTransactions}
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
  );
}