"use client";

import DashboardWrapper from "@/components/layout/DashboardWrapper";
import { useEffect, useState, useCallback } from "react";
import BudgetModal from "@/components/BudgetModal";

// ---------------- TYPES ----------------
interface Budget {
  category: string;
  budget: number;
  spent: number;
  remaining: number;
  progress: number;
  status: "safe" | "warning" | "exceeded";
}

// ---------------- HELPERS ----------------
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const statusConfig = {
  safe: {
    color: "bg-lime-400",
    text: "text-lime-400",
    label: "Safe",
    border: "hover:border-lime-400/40",
  },
  warning: {
    color: "bg-yellow-400",
    text: "text-yellow-400",
    label: "Near Limit",
    border: "hover:border-yellow-400/40",
  },
  exceeded: {
    color: "bg-red-500",
    text: "text-red-500",
    label: "Exceeded",
    border: "hover:border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.06)]",
  },
};

// ---------------- CARD ----------------
const BudgetCard = ({ 
  budget, 
  onEdit, 
  onDelete 
}: { 
  budget: Budget; 
  onEdit: (b: Budget) => void;
  onDelete: (category: string) => void;
}) => {
  const [width, setWidth] = useState(0);
  const config = statusConfig[budget.status];
  const isExceeded = budget.remaining < 0;

  useEffect(() => {
    const t = setTimeout(() => {
      setWidth(Math.min(budget.progress * 100, 100));
    }, 100);
    return () => clearTimeout(t);
  }, [budget.progress]);

  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-2xl p-4 transition-all duration-300 ${config.border} group relative`}>
      
      {/* Action Buttons (Visible on Hover) */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-zinc-950 p-1 rounded-md shadow-lg border border-zinc-800">
        <button onClick={() => onEdit(budget)} className="text-zinc-400 hover:text-white text-xs px-2 py-1">
          Edit
        </button>
        <button onClick={() => onDelete(budget.category)} className="text-red-400 hover:text-red-300 text-xs px-2 py-1 border-l border-zinc-800">
          Delete
        </button>
      </div>

      {/* Top */}
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-white font-medium text-sm sm:text-base pr-20">
          {budget.category}
        </h3>
      </div>
      <div className="mb-3">
        <span className="text-xs sm:text-sm text-zinc-400">
          {formatCurrency(budget.spent)} / {formatCurrency(budget.budget)}
        </span>
      </div>

      {/* Progress */}
      <div className="w-full h-2 bg-zinc-800 rounded-full mt-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${config.color}`}
          style={{ width: `${width}%` }}
        />
      </div>

      {/* Bottom */}
      <div className="flex justify-between items-center mt-2 text-xs">
        <span className="text-zinc-400">
          {isExceeded
            ? `Exceeded by ${formatCurrency(Math.abs(budget.remaining))}`
            : `${formatCurrency(budget.remaining)} left`}
        </span>
        <span className={config.text}>{config.label}</span>
      </div>
    </div>
  );
};

// ---------------- LOADING SKELETON ----------------
const SkeletonCard = () => (
  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 animate-pulse space-y-3">
    <div className="h-4 bg-zinc-800 rounded w-1/2" />
    <div className="h-2 bg-zinc-800 rounded w-full" />
    <div className="h-3 bg-zinc-800 rounded w-1/3" />
  </div>
);

// ---------------- PAGE ----------------
export default function BudgetPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Used to re-trigger useEffect

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  // Abstracted fetch function to use inside useEffect and for manual refreshing
  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/budgets?month=${month}&year=${year}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch budgets");

      const data: Budget[] = await res.json();

      // Sort by priority
      data.sort((a, b) => {
        const order = { exceeded: 0, warning: 1, safe: 2 };
        return order[a.status] - order[b.status];
      });

      setBudgets(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  // Trigger fetch on mount or when refreshKey changes
  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets, refreshKey]);

  // Delete Handler
  const handleDelete = async (category: string) => {
    if (!confirm(`Are you sure you want to delete the budget for ${category}?`)) return;
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/budgets/${category}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete budget");
      
      // Refresh list
      setRefreshKey((prev) => prev + 1);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const handleOpenModal = (budget?: Budget) => {
    setEditingBudget(budget || null);
    setIsModalOpen(true);
  };

  return (
    <DashboardWrapper>
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 space-y-6 bg-zinc-900/95 border border-white/5 rounded-2xl relative">
        
        {/* Header with Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-white">Budgets</h1>
            <p className="text-sm text-zinc-400">
              Plan your monthly spending, track progress in real time, and stay ahead of your limits.
            </p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-white text-zinc-950 text-sm font-medium rounded-lg hover:bg-zinc-200 transition-colors whitespace-nowrap"
          >
            + Add Budget
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <p className="text-red-400 text-sm bg-red-500/10 p-4 rounded-lg border border-red-500/20">{error}</p>
        ) : budgets.length === 0 ? (
          <div className="text-center py-20 bg-zinc-950/50 rounded-2xl border border-zinc-800 border-dashed text-zinc-400">
            <p className="text-base text-white mb-1">No budgets for this month</p>
            <p className="text-sm mb-4">Start by setting limits for your categories</p>
            <button 
              onClick={() => handleOpenModal()}
              className="text-sm text-blue-400 hover:text-blue-300 underline underline-offset-4"
            >
              Create your first budget
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {budgets.map((b) => (
              <BudgetCard 
                key={b.category} 
                budget={b} 
                onEdit={handleOpenModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reusable Modal Component */}
      <BudgetModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBudget(null);
        }}
        onSuccess={() => setRefreshKey(prev => prev + 1)}
        existingBudget={editingBudget}
        month={month}
        year={year}
      />
    </DashboardWrapper>
  );
}