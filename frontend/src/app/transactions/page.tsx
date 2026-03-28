"use client";

import { useState, useEffect } from "react";
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
  category: string;
  transactionDate: string;
  paymentMethod: "cash" | "bank";
  type: "income" | "expense";
  note?: string;
  amount: number;
};
const CATEGORIES = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Gift",
  "Pocket Money",
  "Food & Dining",
  "Groceries",
  "Transport",
  "Rent",
  "Utilities",
  "Shopping",
  "Entertainment",
  "Travel",
  "Health",
  "Education",
  "Subscriptions",
  "Other",
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [form, setForm] = useState({
    category: "",
    paymentMethod: "cash",
    type: "expense",
    note: "",
    amount: 0,
    transactionDate: "",
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:5000/transactions?page=${page}&limit=7`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        setTransactions(Array.isArray(data?.transactions) ? data.transactions : []);
        setTotalPages(typeof data?.totalPages === "number" ? data.totalPages : 1);
      } catch (err) {
        console.error(err);
        setTransactions([]);
      }
    };

    fetchTransactions();
  }, [page]);
  const handleDelete = async (id: string) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5000/transactions/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to delete");
    }

      
      setTransactions((prev) => prev.filter((t) => t._id !== id));

    } catch (err) {
      console.error("Delete error:", err);
    }
  };
      const handleUpdate = async () => {
        if (!editing) return;

        // 🔥 Validation (match backend)
        if (!form.category || !form.type || !form.amount) {
          alert("Please fill all required fields");
          return;
        }

        if (form.amount <= 0) {
          alert("Amount must be greater than 0");
          return;
        }

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
        } catch (err) {
          console.error("Update error:", err);
        }
      };

  return (
    <DashboardWrapper>
      <div className="flex-1 rounded-2xl backdrop-blur-xl font-sans border border-white/5 px-4 sm:px-6 lg:px-8 py-6 space-y-6 bg-zinc-900/95 min-h-screen">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-white">
              Transactions
            </h1>
            <p className="text-sm text-gray-400">
              Monitor every transaction across your accounts.
            </p>
          </div>

          <div className="flex gap-2 sm:gap-3">
            <button className="px-4 py-2 rounded-lg bg-lime-400 text-black font-medium hover:opacity-90 transition">
              + Add Transaction
            </button>
            <button className="px-4 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition">
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-zinc-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-lime-500 hover:bg-lime-500 transition-none border-b border-lime-600">
                <TableHead className="px-6 py-4 text-sm font-semibold text-black">Category</TableHead>
                <TableHead className="px-6 py-4 text-sm font-semibold text-black">Account</TableHead>
                <TableHead className="px-6 py-4 text-sm font-semibold text-black">Type</TableHead>
                <TableHead className="px-6 py-4 text-sm font-semibold text-black">Notes</TableHead>
                <TableHead className="px-6 py-4 text-sm font-semibold text-black text-right">Amount</TableHead>
                <TableHead className="px-6 py-4 text-sm font-semibold text-black text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-400">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((t) => (
                  <TableRow
                    key={t._id}
                    className="hover:bg-white/5 transition border-b border-zinc-800"
                  >
                    {/* Category */}
                    <TableCell className="px-6 py-4 align-middle">
                      <div className="flex flex-col leading-tight">
                        <span className="text-white font-medium">{t.category}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(t.transactionDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </TableCell>

                    {/* Account */}
                    <TableCell className="px-6 py-4 text-gray-300 align-middle">
                      {t.paymentMethod}
                    </TableCell>

                    {/* Type */}
                    <TableCell className="px-6 py-4 align-middle">
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

                    {/* Notes */}
                    <TableCell className="px-6 py-4 text-sm text-gray-400 align-middle">
                      {t.note}
                    </TableCell>

                    {/* Amount */}
                    <TableCell className="px-6 py-4 text-right font-semibold align-middle">
                      <span
                        className={
                          t.type === "income"
                            ? "text-lime-400"
                            : "text-red-400"
                        }
                      >
                        {t.type === "income" ? "+" : "-"}₹
                        {t.amount.toLocaleString("en-IN")}
                      </span>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-6 py-4 text-right align-middle">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="hover:bg-white/10"
                          onClick={() => {
                            setEditing(t);
                            setForm({
                              category: t.category,
                              paymentMethod: t.paymentMethod,
                              type: t.type,
                              note: t.note || "",
                              amount: t.amount,
                              transactionDate: t.transactionDate,
                            });
                          }}
                        >
                          <Pencil className="h-4 w-4 text-gray-300" />
                        </Button>
                        <Button size="icon" variant="ghost" className="hover:bg-red-500/10" onClick={() => handleDelete(t._id)}>
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
        {editing && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-zinc-900 p-6 rounded-xl w-full max-w-md space-y-4 border border-white/10">

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
  <option value="" disabled>
    Select category
  </option>

  {CATEGORIES.map((cat) => (
    <option key={cat} value={cat}>
      {cat}
    </option>
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
            setForm({ ...form, type: e.target.value as "income" | "expense" })
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
            setForm({ ...form, paymentMethod: e.target.value as "cash" | "bank" })
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
          onChange={(e) => setForm({ ...form, note: e.target.value })}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={() => setEditing(null)}
          className="px-4 py-2 border border-white/10 rounded text-gray-300"
        >
          Cancel
        </button>

        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-lime-400 text-black rounded font-medium"
        >
          Save
        </button>
      </div>

    </div>
  </div>
)}

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-400">
            Page <span className="text-white font-medium">{page}</span> of{" "}
            <span className="text-white font-medium">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-gray-300 disabled:opacity-40 hover:bg-white/5 transition"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1.5 rounded-lg ${
                  page === i + 1
                    ? "bg-lime-400 text-black font-medium"
                    : "border border-white/10 text-gray-300 hover:bg-white/5"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-gray-300 disabled:opacity-40 hover:bg-white/5 transition"
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </DashboardWrapper>
  );
}