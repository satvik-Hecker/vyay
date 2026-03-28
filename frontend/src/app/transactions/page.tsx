"use client";
import AddTransactionModal from "@/components/AddTransactionModal";
import { useState, useEffect, useCallback } from "react";
import DashboardWrapper from "@/components/layout/DashboardWrapper";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";

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
  "Salary","Freelance","Business","Investment","Gift","Pocket Money",
  "Food & Dining","Groceries","Transport","Rent","Utilities","Shopping",
  "Entertainment","Travel","Health","Education","Subscriptions","Other",
];

// 🔥 Smart Date
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

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    category: "",
    paymentMethod: "cash",
    type: "expense",
    note: "",
    amount: 0,
    transactionDate: "",
  });

  // Fetch
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null;

        const res = await fetch(
          `http://localhost:5000/transactions?page=${page}&limit=7`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

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

  // Delete
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

  // Update
  const handleUpdate = async () => {
    if (!editing) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/transactions/${editing._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const updated = await res.json();

      setTransactions((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t))
      );

      setEditing(null);
    } catch {}
  };

  // Pagination window
  const getPages = () => {
    const pages = [];
    for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <DashboardWrapper>
      <div className="flex-1 bg-zinc-900/95 min-h-screen px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white">
            Transactions
          </h1>
          <p className="text-sm text-gray-400">
            Track, manage and analyze your finances.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button className="px-4 py-2 rounded-lg bg-lime-400 text-black font-medium hover:opacity-90 transition" onClick={() => setOpen(true)}>
            + Add Transaction
          </Button>

          <button className="px-4 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition">
            Export
          </button>
        </div>
      </div>

        {/* TABLE */}
        <div className="rounded-xl border border-zinc-800 overflow-hidden">

          {/* Desktop */}
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
                      No transactions
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((t) => (
                    <TableRow
                      key={t._id}
                      className="hover:bg-white/5 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
                    >
                      <TableCell className="px-6 py-4 border-b border-zinc-800">
                        <div>
                          <p className="text-white">{t.category}</p>
                          <p className="text-xs text-gray-400">
                            {formatDate(t.transactionDate)}
                          </p>
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

                      <TableCell className="px-6 py-4 border-b border-zinc-800 text-gray-400">
                        {t.note}
                      </TableCell>

                      <TableCell className="px-6 py-4 border-b border-zinc-800 text-right font-semibold">
                        <span className={`transition-all duration-200 ${
                        t.type === "income" ? "text-lime-400" : "text-red-400"
                      }`}>
                          {t.type === "income" ? "+" : "-"}₹
                          {t.amount.toLocaleString("en-IN")}
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

          {/* Mobile */}
          <div className="md:hidden divide-y divide-zinc-800">
            {transactions.map((t) => (
              <div
                key={t._id}
                className="p-4 space-y-3 hover:bg-white/5 transition-all duration-200"
              >
                <div className="flex justify-between items-center">
                  <p className="text-white font-medium">{t.category}</p>
                  <p className={t.type === "income" ? "text-lime-400" : "text-red-400"}>
                    {t.type === "income" ? "+" : "-"}₹{t.amount}
                  </p>
                </div>

                <div className="flex justify-between text-xs text-gray-400">
                  <span>{formatDate(t.transactionDate)}</span>
                  <span>{t.paymentMethod}</span>
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
                    <Button size="icon" variant="ghost">
                      <Pencil className="h-4 w-4 text-zinc-200" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {editing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
            
            <div className="bg-zinc-900 p-4 sm:p-6 rounded-xl w-full max-w-md mx-4 space-y-4 border border-white/10 animate-in zoom-in-95 duration-200">

              <h2 className="text-lg font-semibold text-white">
                Edit Transaction
              </h2>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-sm text-gray-400">Category</label>
                <select
                  className="w-full p-2 rounded bg-zinc-800 text-white"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div className="space-y-1">
                <label className="text-sm text-gray-400">Type</label>
                <select
                  className="w-full p-2 rounded bg-zinc-800 text-white"
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: e.target.value as "income" | "expense",
                    })
                  }
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              {/* Account */}
              <div className="space-y-1">
                <label className="text-sm text-gray-400">Account</label>
                <select
                  className="w-full p-2 rounded bg-zinc-800 text-white"
                  value={form.paymentMethod}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      paymentMethod: e.target.value as "cash" | "bank",
                    })
                  }
                >
                  <option value="cash">Cash</option>
                  <option value="bank">Bank</option>
                </select>
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <label className="text-sm text-gray-400">Amount</label>
                <input
                  type="number"
                  className="w-full p-2 rounded bg-zinc-800 text-white"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({ ...form, amount: Number(e.target.value) })
                  }
                />
              </div>

              {/* Date */}
              <div className="space-y-1">
                <label className="text-sm text-gray-400">Date</label>
                <input
                  type="date"
                  className="w-full p-2 rounded bg-zinc-800 text-white"
                  value={form.transactionDate?.slice(0, 10)}
                  onChange={(e) =>
                    setForm({ ...form, transactionDate: e.target.value })
                  }
                />
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-sm text-gray-400">Notes</label>
                <input
                  className="w-full p-2 rounded bg-zinc-800 text-white"
                  value={form.note}
                  onChange={(e) =>
                    setForm({ ...form, note: e.target.value })
                  }
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </Button>

                <Button
                  className="bg-lime-400 text-black"
                  onClick={handleUpdate}
                >
                  Save
                </Button>
              </div>

            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center">
          <p className="text-gray-400 text-sm">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>
              Prev
            </Button>

            {getPages().map((p) => (
              <Button
                key={p}
                onClick={() => setPage(p)}
                className={page === p ? "bg-lime-400 text-black" : ""}
              >
                {p}
              </Button>
            ))}

            <Button variant="outline" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
              Next
            </Button>
          </div>
        </div>

      </div>
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