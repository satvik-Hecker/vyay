"use client";

import { useState } from "react";
import { toast } from "sonner";
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

/* ---------- PARSER ---------- */

function parseTransaction(text: string) {
  const lower = text.toLowerCase();

  let type: "income" | "expense" | undefined;

  if (["debited","spent","paid","sent"].some(k => lower.includes(k))) {
    type = "expense";
  } else if (["credited","received","salary","earned"].some(k => lower.includes(k))) {
    type = "income";
  }

  let amount: number | undefined;

  const rsMatch = text.match(/rs\.?\s?([\d,]+(\.\d+)?)/i);
  if (rsMatch) {
    amount = Number(rsMatch[1].replace(/,/g, ""));
  }

  let account: "cash" | "bank" = "cash";

  if (lower.includes("upi") || lower.includes("account") || lower.includes("bank")) {
    account = "bank";
  }

  let date: string | undefined;

  const match =
    text.match(/\b\d{2}[-/]\d{2}[-/]\d{2,4}\b/) ||
    text.match(/\b\d{4}-\d{2}-\d{2}\b/);

  if (match) {
    const raw = match[0].replace(/\//g, "-");
    const parts = raw.split("-");
    if (parts[2].length === 2) {
      date = `20${parts[2]}-${parts[1]}-${parts[0]}`;
    } else {
      date = raw;
    }
  }

  return { amount, type, account, date };
}

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

  const [quickInput, setQuickInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(false);

  const categories =
    form.type === "income"
      ? INCOME_CATEGORIES
      : EXPENSE_CATEGORIES;

  /* ---------- PARSE ---------- */

  function handleParse(text: string) {
    const parsed = parseTransaction(text);

    setForm((prev) => ({
      ...prev,
      amount: parsed.amount ?? prev.amount,
      type: parsed.type ?? prev.type,
      paymentMethod: parsed.account ?? prev.paymentMethod,
      transactionDate: parsed.date ?? prev.transactionDate,
    }));

    if (parsed.amount || parsed.type) {
      setHighlight(true);
      setTimeout(() => setHighlight(false), 800);

      toast.success("Auto-filled ✨", { duration: 1000 });
    }
  }

  /* ---------- SUBMIT ---------- */

  async function handleSubmit() {
    if (!form.amount) {
      toast.error("Amount is required");
      return;
    }

    if (!form.category) {
      toast.error("Select a category");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Not authenticated");
        return;
      }

      const promise = fetch("http://localhost:5000/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      toast.promise(promise, {
        loading: "Adding transaction...",
        success: "Transaction added 🎉",
        error: "Failed to add transaction",
      });

      const res = await promise;
      const data = await res.json();

      onSuccess?.(data);
      setOpen(false);

    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  /* ---------- UI ---------- */

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-275! w-[95vw] md:h-[62vh] sm:h-[100vh] bg-zinc-900 text-white border border-white/10 p-0 overflow-hidden rounded-xl">

        <div className="flex flex-col h-full">

          {/* HEADER */}
          <DialogHeader className="px-6 py-4 border-b border-white/10">
            <DialogTitle className="text-xl font-semibold">
              Add Transaction
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2">

            {/* LEFT */}
            <div className="p-6 space-y-5 overflow-y-auto bg-zinc-900">

              {/* AMOUNT */}
              <Input
                type="number"
                placeholder="₹ Amount"
                value={form.amount === 0 ? "" : form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: Number(e.target.value) })
                }
                className={`bg-zinc-800 border border-white/10 transition-all duration-300
                  focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/40
                  hover:border-white/20 focus:scale-[1.01]
                  ${highlight ? "ring-2 ring-lime-400/40 scale-[1.02]" : ""}
                `}
              />

              {/* TYPE */}
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value as "income" | "expense",
                    category: "",
                  })
                }
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-white/10 text-sm
                transition-all duration-200 focus:ring-2 focus:ring-lime-400/50
                hover:border-white/20"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>

              {/* CATEGORY */}
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-white/10 text-sm
                transition-all duration-200 focus:ring-2 focus:ring-lime-400/50
                hover:border-white/20"
              >
                <option value="">Category</option>
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              {/* ACCOUNT */}
              <select
                value={form.paymentMethod}
                onChange={(e) =>
                  setForm({
                    ...form,
                    paymentMethod: e.target.value as "cash" | "bank",
                  })
                }
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-white/10 text-sm
                transition-all duration-200 focus:ring-2 focus:ring-lime-400/50
                hover:border-white/20"
              >
                <option value="cash">Cash</option>
                <option value="bank">Bank</option>
              </select>

              {/* DATE */}
              <Input
                type="date"
                value={form.transactionDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    transactionDate: e.target.value,
                  })
                }
                className="bg-zinc-800 border border-white/10 transition-all duration-200
                focus:ring-2 focus:ring-lime-400/50 hover:border-white/20"
              />

              {/* NOTE */}
              <Input
                placeholder="Add note"
                value={form.note}
                onChange={(e) =>
                  setForm({ ...form, note: e.target.value })
                }
                className="bg-zinc-800 border border-white/10 transition-all duration-200
                focus:ring-2 focus:ring-lime-400/50 hover:border-white/20"
              />

              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-lime-400 text-black font-semibold
                transition-all duration-200 hover:scale-[1.02]
                active:scale-[0.97] shadow-md hover:shadow-lime-400/20"
              >
                {loading ? "Adding..." : "Add Transaction"}
              </Button>
            </div>

            {/* RIGHT */}
            <div className="p-6 border-l border-white/10 space-y-4 overflow-y-auto bg-zinc-950">

              <p className="text-sm text-gray-400">
                Paste SMS or type transaction
              </p>

              <textarea
                value={quickInput}
                onChange={(e) => {
                  setQuickInput(e.target.value);
                  handleParse(e.target.value);
                }}
                placeholder="Paste bank SMS..."
                className="w-full h-36 p-3 rounded-lg bg-zinc-800 border border-white/10
                transition-all duration-200 focus:ring-2 focus:ring-lime-400/50
                hover:border-white/20 resize-none"
              />

              <div className="space-y-2 text-xs">
                <p className="text-gray-500">Examples</p>

                {[
                  "Spent 200 on food",
                  "Salary 50000 credited",
                  "Paid 150 for Uber",
                ].map((ex) => (
                  <button
                    key={ex}
                    onClick={() => {
                      setQuickInput(ex);
                      handleParse(ex);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-lg bg-white/5
                    transition-all duration-200 hover:bg-white/10
                    hover:translate-x-1 active:scale-[0.98]"
                  >
                    {ex}
                  </button>
                ))}
              </div>

            </div>

          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}