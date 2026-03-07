"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import SearchHeader from "@/components/dashboard/SearchHeader";
import StatCard from "@/components/dashboard/StatCard";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const BASE_URL = "http://localhost:5000";

type Stat = {
  title: string;
  value: string;
  subtitle: string;
  primary?: boolean;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${BASE_URL}/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setStats([
          {
            title: "Total Balance",
            value: `₹${data.totalBalance}`,
            subtitle: "Updated just now",
            primary: true,
          },
          {
            title: "Monthly Income",
            value: `₹${data.monthlyIncome}`,
            subtitle: "This month",
          },
          {
            title: "Monthly Expense",
            value: `₹${data.monthlyExpense}`,
            subtitle: "This month",
          },
          {
            title: "Transactions",
            value: String(data.transactionCount),
            subtitle: "This month",
          },
        ]);
      } catch (error) {
        console.error("Dashboard fetch error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  if (loading) return null;

  return (
    <div className="flex gap-4 p-4 bg-zinc-950 min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col gap-4">
        <SearchHeader />

        <div className="bg-zinc-900 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>

          Dashboard content
        </div>
      </div>
    </div>
  );
}