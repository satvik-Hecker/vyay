"use client";

import { useState, useEffect, useMemo } from "react";
import DashboardWrapper from "@/components/layout/DashboardWrapper";
import { CloudSync } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { 
  Car01Icon, 
  PokemonIcon, 
  ChartBreakoutSquareIcon, 
  Pizza01Icon, 
  ShoppingBag01Icon, 
  Calendar03Icon, 
  Ticket01Icon, 
  Target02Icon, 
  RainbowIcon, 
  Award02Icon, 
  Sword01Icon, 
  LeftToRightListDashIcon,
  Fire02Icon,
  DashboardSquare01Icon,
  FilterIcon,
  CheckListIcon,
  Flag01Icon,
  StarsIcon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

// --- Types ---
interface AnalyticsData {
  currentMonth: string;
  totalSpent: number;
  spendingRatePerDay: number;
  projectedEndTotal: number;
  categories: { name: string; value: number }[];
}

interface TooltipPayload {
  name: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<TooltipPayload>;
}

const CHART_COLORS = ['#bef264', '#34d399', '#38bdf8', '#c084fc', '#fbbf24', '#f472b6'];

export default function AnalyticsPage() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);

  const currentDate = useMemo(() => new Date(), []);
  const currentMonthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Unified INR Currency Formatter
  const formatCurrency = (num: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num);

  const insight = useMemo(() => {

    if (!data || data.categories.length === 0) return null;



    const topCat = data.categories[0];

    const secondCat = data.categories[1];

    const total = data.totalSpent;

    const pace = data.spendingRatePerDay;

    const projection = data.projectedEndTotal;

    const daysPassed = currentDate.getDate();

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();



    // 1. VELOCITY (SPEED)

    if (daysPassed < 5 && pace > 2000) return { icon: Car01Icon, title: "Aggressive Start", text: "You've hit the ground running. Early high spending can tighten your budget by week 3.", color: "text-red-400" };

    if (pace < 200 && total > 0) return { icon: PokemonIcon, title: "Steady Pace", text: "Impressive discipline! Your daily average is remarkably low. You're well-positioned.", color: "text-lime-400" };

    if (projection > total * 3 && daysPassed > 10) return { icon: ChartBreakoutSquareIcon, title: "Spending Spike", text: "Recent activity pushed up your forecast. Watch out for 'invisible' small costs.", color: "text-amber-400" };



    // 2. CATEGORY DOMINANCE

    if (topCat.name.toLowerCase() === "food" && (topCat.value / total) > 0.4) return { icon: Pizza01Icon, title: "Foodie Alert", text: "Dining is eating up 40%+ of your spend. Home-cooked meals could save you plenty.", color: "text-orange-400" };

    if (topCat.name.toLowerCase() === "shopping" && (topCat.value / total) > 0.3) return { icon: ShoppingBag01Icon, title: "Retail Therapy", text: "Shopping is your #1 expense. Ask if it was a 'need' before the next checkout.", color: "text-purple-400" };

    if (topCat.name.toLowerCase() === "bills" || topCat.name.toLowerCase() === "subscription") return { icon: Calendar03Icon, title: "Fixed Costs", text: "Recurring bills are your largest slice. Focus on variable spends like leisure to save.", color: "text-blue-400" };

    if (topCat.name.toLowerCase() === "entertainment" && (topCat.value / total) > 0.2) return { icon: Ticket01Icon, title: "High Fun-Factor", text: "Investing heavily in experiences? Ensure your 'future self' has enough savings too.", color: "text-pink-400" };



    // 3. DIVERSITY

    if (data.categories.length === 1) return { icon: Target02Icon, title: "Hyper-Focused", text: "Only one category so far. This makes your budget very predictable—keep it up!", color: "text-cyan-400" };

    if (data.categories.length > 6) return { icon: RainbowIcon, title: "Diverse Spending", text: "Your money is everywhere! This usually means lots of small, unplanned purchases.", color: "text-indigo-400" };

    if (topCat.value > (total - topCat.value)) return { icon: FilterIcon, title: "Top-Heavy", text: `${topCat.name} is bigger than all other categories combined. Watch this area closely.`, color: "text-rose-400" };



    // 4. FORECASTING

    if (daysPassed > 20 && projection < 10000) return { icon: Award02Icon, title: "Home Stretch", text: "You're in the final stretch and looking strong. Surplus savings are likely!", color: "text-emerald-400" };

    if (secondCat && (topCat.value - secondCat.value) < 100) return { icon: Sword01Icon, title: "Category Duel", text: `${topCat.name} and ${secondCat.name} are neck-and-neck for your biggest expense.`, color: "text-yellow-400" };



    // 5. LIFESTYLE

    if (daysPassed % 7 === 0) return { icon: LeftToRightListDashIcon, title: "Weekly Review", text: "It's been a full week. Take 2 minutes to check for any 'oops' transactions.", color: "text-sky-400" };

    if (projection > 50000) return { icon: Fire02Icon, title: "High Burn Rate", text: "Your projected total is looking high. Is it a one-time purchase or a daily habit?", color: "text-red-500" };

    if (daysPassed > 15 && daysPassed < 20) return { icon: DashboardSquare01Icon, title: "Mid-Month Check", text: "Halfway through! Try a 'No Spend Weekend' to reset your daily pace.", color: "text-violet-400" };



    // 6. BEHAVIORAL

    if (total > 5000 && total < 15000) return { icon: CheckListIcon, title: "Moderate Zone", text: "Maintaining a middle-of-the-road spend. Not too tight, not too loose.", color: "text-lime-500" };

    if (daysInMonth - daysPassed < 3) return { icon: Flag01Icon, title: "Finish Line", text: "Only a few days left! Resist the splurge urge just because budget is left.", color: "text-blue-500" };



    return { icon: StarsIcon, title: "Vyay Insight", text: "Keep tracking. I'll alert you if I see unusual patterns in your categories.", color: "text-lime-400" };

  }, [data, currentDate]); // Added dependencies

  const fetchAnalytics = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await fetch(`${API_URL}/analytics/current-month`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      if (result.success) setData(result.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className="bg-zinc-900 border border-white/10 p-3 rounded-xl shadow-xl backdrop-blur-md">
          <p className="text-sm text-gray-400 mb-1">{payload[0].name}</p>
          <p className="text-lg font-semibold text-white">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardWrapper>
      {/* 1. FIXED HEIGHT: min-h-screen allows it to naturally scroll on mobile */}
      <div className="flex-1 rounded-2xl backdrop-blur-xl font-sans border border-white/5 px-4 sm:px-6 lg:px-8 py-6 space-y-6 bg-zinc-900/95 h-[calc(100vh-1.5rem)] md:h-[calc(100vh-2rem)] pb-4">
        
        {/* 🧭 Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-semibold text-white">Analytics</h1>
              <span className="px-3 py-1 rounded-full bg-white/5 text-lime-400 text-sm font-medium border border-lime-400/20">
                {currentMonthYear}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">Analyze your current spending behavior and categories.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={() => fetchAnalytics(true)}
              disabled={refreshing || loading}
              className="px-4 py-2 flex gap-2 items-center justify-center rounded-lg bg-lime-400 text-black font-medium hover:opacity-90 active:scale-95 transition disabled:opacity-50"
            >
              <CloudSync className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-white/5 animate-pulse rounded-2xl border border-white/5"></div>
              ))}
            </div>
            <div className="h-96 bg-white/5 animate-pulse rounded-2xl border border-white/5 w-full"></div>
          </div>
        ) : data ? (
          <div className="space-y-6">

            {/* 🔢 Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Daily Pace" value={formatCurrency(data.spendingRatePerDay)} subtitle="avg per day" highlighted={true} />
              <StatCard title="Total Spent" value={formatCurrency(data.totalSpent)} subtitle="this month" />
              <StatCard title="Projected" value={formatCurrency(data.projectedEndTotal)} subtitle="est. total" />
              <StatCard title="Top Category" value={data.categories.length > 0 ? data.categories[0].name : "N/A"} subtitle={data.categories.length > 0 ? `Max: ${formatCurrency(data.categories[0].value)}` : "No data"} />
            </div>

            {/* 📊 MAIN GRID: 3 columns for Pie, 2 for AI to give AI more breathing room on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">

              {/* Category Breakdown Card */}
              <div className="lg:col-span-3 p-4 sm:p-6 rounded-2xl bg-zinc-900 border border-white/5 flex flex-col h-84">
                <h3 className="text-lg font-medium text-white ">Category Distribution</h3>
                {data.categories.length > 0 ? (
                  <div className="flex-1 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        {/* 2. FIXED CHART: Centered with bottom legend to guarantee mobile visibility */}
                        <Pie
                          data={data.categories}
                          cx="50%"
                          cy="45%"
                          innerRadius={65}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {data.categories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                          layout="horizontal" 
                          verticalAlign="bottom"
                          align="center" 
                          iconType="circle"
                          wrapperStyle={{ paddingTop: "15px", fontSize: "13px" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    No transactions found for this month.
                  </div>
                )}
              </div>

              {/* Vyay AI Insights Card */}
              
              <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-zinc-900 border border-white/5 flex flex-col gap-12 relative overflow-hidden group h-84">
                
                <div className="absolute -top-16 -right-16 w-40 h-40 bg-lime-400/10 blur-[80px] rounded-full group-hover:bg-lime-400/15 transition-colors duration-500 pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-blue-500/5 blur-[60px] rounded-full pointer-events-none" />

                <div className="relative z-10 space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-lg relative z-10">
                        {insight && <HugeiconsIcon icon={insight.icon} size={20} className={insight.color} />}
                      </div>
                      <div className="absolute inset-0 rounded-xl bg-lime-400/20 animate-ping opacity-20" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white tracking-wider mb-1">Vy-AI Insights</h3>
                      <div className="flex items-center gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                        <span className="text-[10px] text-lime-400/80 uppercase font-bold tracking-widest">Live Analysis</span>
                      </div>
                    </div>
                  </div>
                  </div>

                  <div>
                    <div className="space-y-2">
                      <p className={`text-xs font-bold uppercase tracking-[0.15em] ${insight?.color || "text-lime-400"}`}>
                        {insight?.title || "Scanning patterns..."}
                      </p>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {insight?.text || "Analyzing your spending behavior to give you personalized financial advice."}
                      </p>
                    </div>
                  </div>

                <Link 
                  href="/vy-ai"
                  className="mt-6 w-full py-2.5 rounded-xl bg-lime-400 text-zinc-900 text-sm font-semibold flex items-center justify-center gap-2 group/btn hover:bg-lime-500 transition-all active:scale-[0.98] relative z-10 shadow-md"
                >
                  <span>Talk to Vy-AI</span>
                  <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>

            </div>
          </div>
        ) : (
          <div className="flex-1 p-10 text-red-400 text-center bg-white/5 rounded-2xl border border-white/10 mt-6">
            Failed to load analytics data.
          </div>
        )}
      </div>
    </DashboardWrapper>
  );
}