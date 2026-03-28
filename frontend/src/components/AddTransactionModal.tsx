"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/* ---------- TYPES ---------- */

type TransactionInput = {
  amount: number;
  type: "income" | "expense";
  category: string;
  paymentMethod: "cash" | "bank";
  transactionDate: string;
  note?: string;
};
type Transaction = {
  _id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  paymentMethod: "cash" | "bank";
  transactionDate: string;
  note?: string;
};

/* ---------- CONSTANTS ---------- */

const EXPENSE_CATEGORIES = [
  "Food & Dining","Groceries","Transport","Shopping","Entertainment",
  "Travel","Health","Education","Bills","Subscriptions","Other"
];

const INCOME_CATEGORIES = [
  "Salary","Freelance","Business","Investment","Gift","Other"
];

/* ---------- COMPONENT ---------- */

export default function AddTransactionModal({
  open,
  setOpen,
  onSuccess,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  onSuccess?: (txn: Transaction) => void;
}) {
  const [form, setForm] = useState<TransactionInput>({
    amount: 0,
    type: "expense",
    category: "",
    paymentMethod: "cash",
    transactionDate: new Date().toISOString().slice(0, 10),
    note: "",
  });

  const [loading, setLoading] = useState(false);

  /* ---------- HANDLERS ---------- */

  const categories =
    form.type === "income"
      ? INCOME_CATEGORIES
      : EXPENSE_CATEGORIES;

  async function handleSubmit() {
    if (!form.amount || !form.category) return;

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();

      onSuccess?.(data);

      // reset
      setForm({
        amount: 0,
        type: "expense",
        category: "",
        paymentMethod: "cash",
        transactionDate: new Date().toISOString().slice(0, 10),
        note: "",
      });

      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  /* ---------- UI ---------- */

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-zinc-900 text-white border border-white/10 max-w-md">
        
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          {/* Amount */}
          <Input
            type="number"
            placeholder="Amount"
            value={form.amount || ""}
            onChange={(e) =>
              setForm({ ...form, amount: Number(e.target.value) })
            }
            className="bg-zinc-800"
          />

          {/* Type */}
          <select
            className="w-full p-2 rounded bg-zinc-800"
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value as "income" | "expense",
                category: "", // reset category on type change
              })
            }
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          {/* Category */}
          <select
            className="w-full p-2 rounded bg-zinc-800"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>

          {/* Account */}
          <select
            className="w-full p-2 rounded bg-zinc-800"
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

          {/* Date */}
          <Input
            type="date"
            value={form.transactionDate}
            onChange={(e) =>
              setForm({
                ...form,
                transactionDate: e.target.value,
              })
            }
            className="bg-zinc-800"
          />

          {/* Note */}
          <Input
            placeholder="Note (optional)"
            value={form.note}
            onChange={(e) =>
              setForm({ ...form, note: e.target.value })
            }
            className="bg-zinc-800"
          />

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-lime-400 text-black"
          >
            {loading ? "Adding..." : "Add Transaction"}
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
}