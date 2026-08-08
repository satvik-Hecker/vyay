"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

const EXPENSE_TYPE_KEYWORDS = ["debited", "spent", "paid", "sent", "withdrawn", "purchased", "bought", "debit"];
const INCOME_TYPE_KEYWORDS = ["credited", "received", "salary", "earned", "credit", "deposited", "refund", "cashback", "bonus"];

const EXPENSE_CATEGORY_KEYWORDS: Record<string, string[]> = {
  "Food & Dining": ["food", "restaurant", "swiggy", "zomato", "lunch", "dinner", "breakfast", "cafe", "coffee", "dining"],
  "Groceries": ["grocery", "groceries", "supermarket", "bigbasket", "blinkit", "zepto", "dmart"],
  "Transport": ["uber", "ola", "cab", "taxi", "auto", "fuel", "petrol", "diesel", "metro", "bus", "train", "rapido", "parking"],
  "Rent": ["rent"],
  "Utilities": ["electricity", "water bill", "wifi", "internet", "broadband", "utility", "utilities", "recharge", "gas bill"],
  "Shopping": ["amazon", "flipkart", "myntra", "shopping", "mall"],
  "Entertainment": ["movie", "netflix", "spotify", "hotstar", "bookmyshow", "entertainment", "prime video"],
  "Travel": ["flight", "hotel", "trip", "travel", "airbnb", "makemytrip", "irctc"],
  "Health": ["hospital", "doctor", "medicine", "pharmacy", "medical", "clinic"],
  "Education": ["tuition", "course", "school", "college", "fees", "books"],
  "Subscriptions": ["subscription", "membership"],
};

const INCOME_CATEGORY_KEYWORDS: Record<string, string[]> = {
  "Salary": ["salary", "payroll"],
  "Pocket Money": ["pocket money", "allowance"],
  "Freelance": ["freelance", "gig", "client project"],
  "Business": ["business", "invoice", "sales"],
  "Investment": ["dividend", "interest", "investment", "mutual fund", "stocks"],
  "Gift": ["gift"],
};

const MONTH_NAMES = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

function earliestIndexOf(lower: string, keywords: string[]): number {
  let min = -1;
  for (const kw of keywords) {
    const idx = lower.indexOf(kw);
    if (idx !== -1 && (min === -1 || idx < min)) min = idx;
  }
  return min;
}

function findEarliestCategory(
  lower: string,
  map: Record<string, string[]>
): { category: string; index: number } | null {
  let best: { category: string; index: number } | null = null;
  for (const [category, keywords] of Object.entries(map)) {
    const idx = earliestIndexOf(lower, keywords);
    if (idx !== -1 && (!best || idx < best.index)) {
      best = { category, index: idx };
    }
  }
  return best;
}

function extractDate(text: string): { date?: string; raw?: string; index?: number } {
  let m = text.match(/\b(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})\b/);
  if (m) {
    const year = m[3].length === 2 ? `20${m[3]}` : m[3];
    const month = m[2].padStart(2, "0");
    const day = m[1].padStart(2, "0");
    return { date: `${year}-${month}-${day}`, raw: m[0], index: m.index };
  }

  m = text.match(/\b\d{4}-\d{2}-\d{2}\b/);
  if (m) return { date: m[0], raw: m[0], index: m.index };

  const monthRegex = new RegExp(`\\b(\\d{1,2})[\\s-]?(${MONTH_NAMES.join("|")})[a-z]*[\\s-]?(\\d{2,4})?\\b`, "i");
  m = text.match(monthRegex);
  if (m) {
    const day = m[1].padStart(2, "0");
    const monthNum = String(MONTH_NAMES.indexOf(m[2].toLowerCase()) + 1).padStart(2, "0");
    const year = m[3] ? (m[3].length === 2 ? `20${m[3]}` : m[3]) : String(new Date().getFullYear());
    return { date: `${year}-${monthNum}-${day}`, raw: m[0], index: m.index };
  }

  return {};
}

function stripNoise(text: string): string {
  return text
    .replace(/(avl\.?\s*bal(ance)?|available\s*balance|\bbal)\.?\s*[:-]?\s*(rs\.?|inr\.?|₹)?\s*[\d,]+(\.\d+)?/gi, " ")
    .replace(/a\/?c\.?\s*(no\.?)?\s*\w*\d{3,}\w*/gi, " ")
    .replace(/card\s*(no\.?)?\s*(ending)?\s*\w*\d{3,}\w*/gi, " ")
    .replace(/\b(ref|txn|utr|order)\.?\s*(id|no)?\.?\s*[:-]?\s*\w*\d{4,}\w*/gi, " ")
    .replace(/x{2,}\d+/gi, " ");
}

function extractAmount(cleanText: string): number | undefined {
  const currencyMatch = cleanText.match(/(?:₹|rs\.?|inr\.?|rupees?)\s*([\d,]+(?:\.\d{1,2})?)/i);
  if (currencyMatch) return Number(currencyMatch[1].replace(/,/g, ""));

  const plainMatch = cleanText.match(/\b\d[\d,]*(?:\.\d{1,2})?\b/);
  if (plainMatch) return Number(plainMatch[0].replace(/,/g, ""));

  return undefined;
}

function extractAccount(lower: string): "cash" | "bank" | undefined {
  if (/\bcash\b/.test(lower)) return "cash";
  if (/(upi|neft|imps|netbanking|\ba\/?c\b|bank|card)/.test(lower)) return "bank";
  return undefined;
}

function parseTransaction(text: string) {
  const lower = text.toLowerCase();

  const expenseCatMatch = findEarliestCategory(lower, EXPENSE_CATEGORY_KEYWORDS);
  const incomeCatMatch = findEarliestCategory(lower, INCOME_CATEGORY_KEYWORDS);

  const expenseVerbIdx = earliestIndexOf(lower, EXPENSE_TYPE_KEYWORDS);
  const incomeVerbIdx = earliestIndexOf(lower, INCOME_TYPE_KEYWORDS);

  let type: "income" | "expense" | undefined;
  if (expenseVerbIdx !== -1 && (incomeVerbIdx === -1 || expenseVerbIdx <= incomeVerbIdx)) {
    type = "expense";
  } else if (incomeVerbIdx !== -1) {
    type = "income";
  } else if (expenseCatMatch && !incomeCatMatch) {
    type = "expense";
  } else if (incomeCatMatch && !expenseCatMatch) {
    type = "income";
  } else if (expenseCatMatch && incomeCatMatch) {
    type = expenseCatMatch.index <= incomeCatMatch.index ? "expense" : "income";
  }

  const category =
    type === "expense" ? expenseCatMatch?.category : type === "income" ? incomeCatMatch?.category : undefined;

  const { date, raw, index } = extractDate(text);
  const withoutDate = raw && index !== undefined ? text.slice(0, index) + " " + text.slice(index + raw.length) : text;
  const cleanText = stripNoise(withoutDate);

  const amount = extractAmount(cleanText);
  const account = extractAccount(lower);

  return { amount, type, account, date, category };
}

/* ---------- CONSTANTS ---------- */

const EXPENSE_CATEGORIES = [
  "Food & Dining","Groceries","Transport", "Rent", "Utilities","Shopping","Entertainment",
  "Travel","Health","Education","Subscriptions","Other"
];

const INCOME_CATEGORIES = [
  "Salary","Pocket Money","Freelance","Business","Investment","Gift" ,"Other"
];

function emptyForm(): TransactionInput {
  return {
    amount: 0,
    type: "expense",
    category: "",
    paymentMethod: "cash",
    transactionDate: new Date().toISOString().slice(0, 10),
    note: "",
  };
}

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
  const [form, setForm] = useState<TransactionInput>(emptyForm);

  const [quickInput, setQuickInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const lastAutofillSignature = useRef<string | null>(null);

  const categories =
    form.type === "income"
      ? INCOME_CATEGORIES
      : EXPENSE_CATEGORIES;

  /* ---------- RESET ON OPEN ---------- */

  useEffect(() => {
    if (open) {
      setForm(emptyForm());
      setQuickInput("");
      lastAutofillSignature.current = null;
    }
  }, [open]);

  /* ---------- PARSE ---------- */

  const handleParse = useCallback((text: string) => {
    const parsed = parseTransaction(text);

    setForm((prev) => {
      const type = parsed.type ?? prev.type;
      const category = parsed.category ?? (type !== prev.type ? "" : prev.category);

      return {
        ...prev,
        amount: parsed.amount ?? prev.amount,
        type,
        category,
        paymentMethod: parsed.account ?? prev.paymentMethod,
        transactionDate: parsed.date ?? prev.transactionDate,
      };
    });

    const hasSignal = parsed.amount !== undefined || parsed.type !== undefined || parsed.category !== undefined;
    if (!hasSignal) return;

    const signature = JSON.stringify([parsed.amount, parsed.type, parsed.category, parsed.account, parsed.date]);
    if (signature !== lastAutofillSignature.current) {
      lastAutofillSignature.current = signature;
      setHighlight(true);
      setTimeout(() => setHighlight(false), 800);

      toast.success("Auto-filled ✨", { duration: 1000 });
    }
  }, []);

  useEffect(() => {
    if (!quickInput.trim()) return;
    const id = setTimeout(() => handleParse(quickInput), 500);
    return () => clearTimeout(id);
  }, [quickInput, handleParse]);

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
      const date = new Date(form.transactionDate);

        date.setHours(new Date().getHours());
        date.setMinutes(new Date().getMinutes());
        date.setSeconds(new Date().getSeconds());

        const payload = {
          ...form,
          transactionDate: date.toISOString(),
        };

      const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
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
      <DialogContent className="max-w-275! w-[95vw] md:h-[62vh] sm:h-screen bg-zinc-900 text-white border border-white/10 p-0 overflow-hidden rounded-xl">

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
                onChange={(e) => setQuickInput(e.target.value)}
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
                    onClick={() => setQuickInput(ex)}
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