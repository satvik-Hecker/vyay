"use client";

// --- Imports ---
import { useState, useEffect, useCallback } from "react";
import { Pencil, Trash2 } from "lucide-react";

// Components
import DashboardWrapper from "@/components/layout/DashboardWrapper";
import AddTransactionModal from "@/components/AddTransactionModal";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// --- Types & Constants ---
type Transaction = {
  _id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  paymentMethod: "cash" | "bank";
  transactionDate: string;
  note?: string;
};

const CATEGORIES = [
  "Salary", "Freelance", "Business", "Investment", "Gift", "Pocket Money",
  "Food & Dining", "Groceries", "Transport", "Rent", "Utilities", "Shopping",
  "Entertainment", "Travel", "Health", "Education", "Subscriptions", "Other",
];

// --- Utilities ---
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// --- Main Component ---
export default function TransactionsPage() {
  // 1. State Declarations
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filter & Sort State
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");
  const [accountFilter, setAccountFilter] = useState<"all" | "cash" | "bank">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sort, setSort] = useState<"newest" | "oldest" | "amount_high" | "amount_low">("newest");
  
  // Modal & Form State
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [form, setForm] = useState({
    category: "",
    paymentMethod: "cash",
    type: "expense",
    note: "",
    amount: 0,
    transactionDate: "",
  });

  // 2. Derived State (Filters & Sorting)
  const processedTransactions = transactions
    .filter((t) => {
      if (typeFilter !== "all" && t.type !== typeFilter) return false;
      if (accountFilter !== "all" && t.paymentMethod !== accountFilter) return false;
      if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sort) {
        case "newest":
          return new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime();
        case "oldest":
          return new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime();
        case "amount_high":
          return b.amount - a.amount;
        case "amount_low":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

  const getPages = () => {
    const pages = [];
    for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
      pages.push(i);
    }
    return pages;
  };

  // 3. Effects (Data Fetching)
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

        const res = await fetch(`http://localhost:5000/transactions?page=${page}&limit=7`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setTransactions(data?.transactions || []);
        setTotalPages(data?.totalPages || 1);
      } catch {
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [page]);

  // 4. Handlers
  const handleDelete = useCallback(async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/transactions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch {}
  }, []);

  const handleUpdate = async () => {
    if (!editing) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/transactions/${editing._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const updated = await res.json();

      setTransactions((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t))
      );

      setEditing(null);
    } catch {}
  };

  // Common styles for the select inputs to keep things perfectly uniform
  const selectClasses = "w-full md:w-auto px-3 py-2 rounded-lg bg-zinc-800 text-white border border-white/10 text-sm focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400/50 transition-all cursor-pointer";

  // 5. Render
  return (
    <DashboardWrapper>
      <div className="flex-1 bg-zinc-900/95 min-h-screen px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
        
        {/* --- Header & Primary Action --- */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white">
            Transactions
          </h1>
          <p className="text-sm text-gray-400">
            A complete log of your income and expenditures.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button className="px-4 py-6 rounded-lg bg-lime-400 text-black font-medium hover:opacity-90 transition" onClick={() => setOpen(true)}>
            + Add Transaction
          </Button>
        </div>
        </div>

        {/* --- Unified Sort & Filters Toolbar --- */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 bg-zinc-800/30 p-3 rounded-xl border border-white/5">
          
          {/* Left Side Group (Sort & Filters) */}
          <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-3">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "newest" | "oldest" | "amount_high" | "amount_low")}
              className={selectClasses}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="amount_high">Sort: Amount (High to Low)</option>
              <option value="amount_low">Sort: Amount (Low to High)</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as "all" | "income" | "expense")}
              className={selectClasses}
            >
              <option value="all">Type: All</option>
              <option value="income">Type: Income</option>
              <option value="expense">Type: Expense</option>
            </select>

            <select
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value as "all" | "cash" | "bank")}
              className={selectClasses}
            >
              <option value="all">Account: All</option>
              <option value="cash">Account: Cash</option>
              <option value="bank">Account: Bank</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={selectClasses}
            >
              <option value="all">Category: All</option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Right Side (Clear Button) */}
          <Button
            variant="outline"
            className="w-full md:w-auto md:ml-auto bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500 hover:text-white transition-all duration-200"
            onClick={() => {
              setTypeFilter("all");
              setAccountFilter("all");
              setCategoryFilter("all");
              setSort("newest");
            }}
          >
            Clear Filters
          </Button>
        </div>

        {/* --- Table Section --- */}
        <div className="rounded-xl border border-zinc-800 overflow-hidden">
          
          {/* Desktop View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader className="sticky top-0 z-10">
                <TableRow className="bg-lime-500 border-b border-lime-600">
                  <TableHead className="px-6 py-4 text-black">Category</TableHead>
                  <TableHead className="px-6 py-4 text-black">Account</TableHead>
                  <TableHead className="px-6 py-4 text-black">Type</TableHead>
                  <TableHead className="px-6 py-4 text-black">Notes</TableHead>
                  <TableHead className="px-6 py-4 text-black text-right">Amount</TableHead>
                  <TableHead className="px-6 py-4 text-black text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-gray-400">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-gray-400">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  processedTransactions.map((t) => (
                    <TableRow
                      key={t._id}
                      className="hover:bg-white/5 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
                    >
                      <TableCell className="px-6 py-4 border-b border-zinc-800">
                        <div>
                          <p className="text-white">{t.category}</p>
                          <p className="text-xs text-gray-400">{formatDate(t.transactionDate)}</p>
                        </div>
                      </TableCell>

                      <TableCell className="px-6 py-4 border-b border-zinc-800 text-gray-300">
                        {t.paymentMethod}
                      </TableCell>

                      <TableCell className="px-6 py-4 border-b border-zinc-800">
                        <Badge
                          className={
                            t.type === "income"
                              ? "bg-lime-400/10 text-lime-400"
                              : "bg-red-400/10 text-red-400"
                          }
                        >
                          {t.type}
                        </Badge>
                      </TableCell>

                      <TableCell className="px-6 py-4 border-b border-zinc-800 text-gray-400 truncate max-w-[200px]">
                        {t.note}
                      </TableCell>

                      <TableCell className="px-6 py-4 border-b border-zinc-800 text-right font-semibold">
                        <span className={`transition-all duration-200 ${t.type === "income" ? "text-lime-400" : "text-red-400"}`}>
                          {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
                        </span>
                      </TableCell>

                      <TableCell className="px-6 py-4 border-b border-zinc-800 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="transition-all duration-200 hover:bg-white/10 hover:scale-105"
                            onClick={() => setEditing(t)}
                          >
                            <Pencil className="h-4 w-4 text-zinc-200" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            className="transition-all duration-200 hover:bg-red-500/10 hover:scale-105"
                            onClick={() => handleDelete(t._id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden divide-y divide-zinc-800">
            {processedTransactions.length === 0 && !loading && (
              <div className="text-center py-10 text-gray-400">No transactions found.</div>
            )}
            {processedTransactions.map((t) => (
              <div key={t._id} className="p-4 space-y-3 hover:bg-white/5 transition-all duration-200">
                <div className="flex justify-between items-center">
                  <p className="text-white font-medium">{t.category}</p>
                  <p className={t.type === "income" ? "text-lime-400 font-semibold" : "text-red-400 font-semibold"}>
                    {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="flex justify-between text-xs text-gray-400">
                  <span>{formatDate(t.transactionDate)}</span>
                  <span className="capitalize">{t.paymentMethod}</span>
                </div>

                <div className="flex justify-between items-center">
                  <Badge
                    className={
                      t.type === "income"
                        ? "bg-lime-400/10 text-lime-400"
                        : "bg-red-400/10 text-red-400"
                    }
                  >
                    {t.type}
                  </Badge>

                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => setEditing(t)}>
                      <Pencil className="h-4 w-4 text-zinc-200" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(t._id)}>
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Edit Transaction Modal --- */}
        {editing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-zinc-900 p-4 sm:p-6 rounded-xl w-full max-w-md mx-4 space-y-4 border border-white/10 animate-in zoom-in-95 duration-200">
              <h2 className="text-lg font-semibold text-white">Edit Transaction</h2>

              <div className="space-y-1">
                <label className="text-sm text-gray-400">Category</label>
                <select
                  className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10 focus:border-lime-400 focus:outline-none"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm text-gray-400">Type</label>
                <select
                  className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10 focus:border-lime-400 focus:outline-none"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as "income" | "expense" })}
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm text-gray-400">Account</label>
                <select
                  className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10 focus:border-lime-400 focus:outline-none"
                  value={form.paymentMethod}
                  onChange={(e) => setForm({ ...form, paymentMethod: e.target.value as "cash" | "bank" })}
                >
                  <option value="cash">Cash</option>
                  <option value="bank">Bank</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm text-gray-400">Amount</label>
                <input
                  type="number"
                  className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10 focus:border-lime-400 focus:outline-none"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm text-gray-400">Date</label>
                <input
                  type="date"
                  className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10 focus:border-lime-400 focus:outline-none"
                  value={form.transactionDate?.slice(0, 10)}
                  onChange={(e) => setForm({ ...form, transactionDate: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm text-gray-400">Notes</label>
                <input
                  className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10 focus:border-lime-400 focus:outline-none"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" className="border-white/10 hover:bg-white/5" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
                <Button className="bg-lime-400 text-black hover:bg-lime-500 transition-colors" onClick={handleUpdate}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* --- Pagination --- */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
            <p className="text-gray-400 text-sm">
              Page {page} of {totalPages}
            </p>

            <div className="flex gap-2">
              <Button variant="outline" className="border-white/10 hover:bg-white/5" disabled={page === 1} onClick={() => setPage(page - 1)}>
                Prev
              </Button>

              {getPages().map((p) => (
                <Button
                  key={p}
                  onClick={() => setPage(p)}
                  variant={page === p ? "default" : "outline"}
                  className={page === p ? "bg-lime-400 text-black hover:bg-lime-500" : "border-white/10 hover:bg-white/5"}
                >
                  {p}
                </Button>
              ))}

              <Button variant="outline" className="border-white/10 hover:bg-white/5" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          </div>
        )}

      </div>

      {/* External Modals */}
      <AddTransactionModal
        open={open}
        setOpen={setOpen}
        onSuccess={(txn) => {
          setTransactions((prev) => [txn, ...prev]);
        }}
      />
    </DashboardWrapper>
  );
}