"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import Link from "next/link";

interface Category {
  name: string;
  value: number;
}

interface MiniCategoryCardProps {
  categories: Category[];
}

interface TooltipPayload {
  name: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<TooltipPayload>;
}

const CHART_COLORS = ['#bef264', '#34d399', '#38bdf8'];

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length > 0) {
    return (
      <div className="bg-zinc-900 border border-white/10 px-3 py-2 rounded-xl shadow-2xl backdrop-blur-md z-50">
        <p className="text-[10px] text-gray-400 mb-0.5 uppercase tracking-wider font-bold">
          {payload[0].name}
        </p>
        <p className="text-sm font-semibold text-lime-400">
          {new Intl.NumberFormat("en-IN", { 
            style: "currency", 
            currency: "INR", 
            maximumFractionDigits: 0 
          }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function MiniCategoryCard({ categories }: MiniCategoryCardProps) {
  
  const formatCurrency = (num: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
      notation: "standard", 
    }).format(num);

  // 1. Logic: Only take the top 3 items
  const topThree = useMemo(() => {
    return [...categories].sort((a, b) => b.value - a.value).slice(0, 3);
  }, [categories]);

  const totalSpent = useMemo(() => {
    return topThree.reduce((sum, item) => sum + item.value, 0);
  }, [topThree]);

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5 flex flex-col h-full relative overflow-hidden group max-w-full">
      
      {/* Header */}
      <div className="flex justify-between items-start relative z-10">
        <div>
          <h3 className="text-white font-medium text-sm mb-2">Top Expenses</h3>
          <p className="text-xl font-bold text-white tracking-tight mt-0.5">
            {formatCurrency(totalSpent)}
          </p>
        </div>
        <Link 
          href="/analytics" 
          className="text-[10px] text-lime-400 uppercase tracking-widest font-bold hover:underline transition-all"
        >
          View All →
        </Link>
      </div>
      
      {/* 2. Chart: Ultra-Compact Bar Chart */}
      {topThree.length > 0 ? (
        <div className="flex-1 w-full min-h-24">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={topThree} 
              layout="vertical" 
              margin={{ top: 0, right: 30, left: -20, bottom: 0 }}
            >
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 500 }}
                width={80}
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              />
              <Bar 
                dataKey="value" 
                radius={[0, 4, 4, 0]} 
                barSize={24}
              >
                {topThree.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={CHART_COLORS[index % CHART_COLORS.length]} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-xs text-gray-500">
          No data available
        </div>
      )}
      
    </div>
  );
}