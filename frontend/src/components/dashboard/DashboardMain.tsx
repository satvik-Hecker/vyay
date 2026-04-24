"use client";

import { useEffect, useState } from "react";
import StatCard from "./StatCard";
import WeeklySpendingCard from "./WeeklySpends";
import RecentTransactionsCard from "./RecentTrans";
import CashBalanceCard from "./BalDistribution";
import { CloudSync } from "lucide-react";
import MiniCategoryCard from "./MiniCategory";



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
  categoryBreakdown: {
    name: string;
    value: number;
  }[];
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

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/dashboard`, {
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
    <div className="flex-1 rounded-2xl backdrop-blur-xl font-sans border border-white/5 px-4 sm:px-6 lg:px-8 py-6 space-y-6 bg-zinc-900/95 h-[calc(100vh-1.5rem)] md:h-[calc(100vh-2rem)]">

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

      {/* 📊 MAIN BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">

        {/* Left Block (Spans 2 cols): Stacked Weekly & Category */}
        <div className="lg:col-span-2 flex flex-col gap-2">
          <div className="flex-1 w-full min-h-0">
            <WeeklySpendingCard data={formattedWeeklyData} />
          </div>
          <div className="flex-1 w-full min-h-0">
            <MiniCategoryCard categories={data.categoryBreakdown || []} />
          </div>
        </div>

        {/* Middle Block: Cash Balance */}
        <div className="lg:col-span-1 h-full">
          <CashBalanceCard
            cash={data.cashVsBalance.cash}
            bank={data.cashVsBalance.bank}
          />
        </div>

        {/* Right Block: Recent Transactions */}
        <div className="lg:col-span-1 h-full">
          <RecentTransactionsCard
            transactions={data.recentTransactions}
          />
        </div>
        
      </div>
    </div>
  );
}
   