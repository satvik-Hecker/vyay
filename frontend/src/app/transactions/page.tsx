"use client";

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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { SlidersHorizontal, Pencil, Trash2 } from "lucide-react";

const transactions = [
  {
    _id: "1",
    category: "Salary",
    transactionDate: "2026-03-25",
    paymentMethod: "bank",
    type: "income",
    note: "Monthly salary credited",
    amount: 50000,
  },
  {
    _id: "2",
    category: "Freelance",
    transactionDate: "2026-03-24",
    paymentMethod: "bank",
    type: "income",
    note: "Website project payment",
    amount: 12000,
  },
  {
    _id: "3",
    category: "Food & Dining",
    transactionDate: "2026-03-23",
    paymentMethod: "cash",
    type: "expense",
    note: "Dinner with friends",
    amount: 850,
  },
  {
    _id: "4",
    category: "Groceries",
    transactionDate: "2026-03-22",
    paymentMethod: "cash",
    type: "expense",
    note: "Weekly groceries",
    amount: 1500,
  },
  {
    _id: "5",
    category: "Transport",
    transactionDate: "2026-03-21",
    paymentMethod: "cash",
    type: "expense",
    note: "Cab rides",
    amount: 400,
  },
  {
    _id: "6",
    category: "Shopping",
    transactionDate: "2026-03-20",
    paymentMethod: "bank",
    type: "expense",
    note: "Clothes from Myntra",
    amount: 3200,
  },
  {
    _id: "7",
    category: "Entertainment",
    transactionDate: "2026-03-19",
    paymentMethod: "bank",
    type: "expense",
    note: "Movie tickets",
    amount: 600,
  },
  {
    _id: "8",
    category: "Investment",
    transactionDate: "2026-03-18",
    paymentMethod: "bank",
    type: "income",
    note: "Stock profit",
    amount: 7000,
  },
  {
    _id: "9",
    category: "Rent",
    transactionDate: "2026-03-17",
    paymentMethod: "bank",
    type: "expense",
    note: "Monthly rent",
    amount: 15000,
  },
  {
    _id: "10",
    category: "Utilities",
    transactionDate: "2026-03-16",
    paymentMethod: "bank",
    type: "expense",
    note: "Electricity bill",
    amount: 2200,
  },
  {
    _id: "11",
    category: "Health",
    transactionDate: "2026-03-15",
    paymentMethod: "cash",
    type: "expense",
    note: "Doctor visit",
    amount: 500,
  },
  {
    _id: "12",
    category: "Education",
    transactionDate: "2026-03-14",
    paymentMethod: "bank",
    type: "expense",
    note: "Online course",
    amount: 3000,
  },
  {
    _id: "13",
    category: "Subscriptions",
    transactionDate: "2026-03-13",
    paymentMethod: "bank",
    type: "expense",
    note: "Netflix subscription",
    amount: 499,
  },
  {
    _id: "14",
    category: "Gift",
    transactionDate: "2026-03-12",
    paymentMethod: "cash",
    type: "expense",
    note: "Birthday gift",
    amount: 1200,
  },
  {
    _id: "15",
    category: "Pocket Money",
    transactionDate: "2026-03-11",
    paymentMethod: "cash",
    type: "income",
    note: "Received from parents",
    amount: 2000,
  },
  {
    _id: "16",
    category: "Travel",
    transactionDate: "2026-03-10",
    paymentMethod: "bank",
    type: "expense",
    note: "Train tickets",
    amount: 1800,
  },
  {
    _id: "17",
    category: "Business",
    transactionDate: "2026-03-09",
    paymentMethod: "bank",
    type: "income",
    note: "Side hustle income",
    amount: 9000,
  },
  {
    _id: "18",
    category: "Other",
    transactionDate: "2026-03-08",
    paymentMethod: "cash",
    type: "expense",
    note: "Misc expenses",
    amount: 300,
  },
];

export default function TransactionsPage() {
  return (
    <DashboardWrapper>
      <div className="flex-1 rounded-2xl backdrop-blur-xl font-sans border border-white/5 px-4 sm:px-6 lg:px-8 py-6 space-y-6 bg-zinc-900/95 min-h-screen">

      {/* 🧭 Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white">
            Transactions
          </h1>
          <p className="text-sm text-gray-400">
            Monitor every transaction across your accounts.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
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
            <TableHeader className="uppercase">
          <TableRow className="bg-lime-500 hover:bg-lime-500 transition-none border-b border-lime-600">
            <TableHead className="px-6 py-2 text-sm font-semibold text-black">
              Category
            </TableHead>
            <TableHead className="px-6 py-2 text-sm font-semibold text-black">
              Payment Method
            </TableHead>
            <TableHead className="px-6 py-2 text-sm font-semibold text-black">
              Type
            </TableHead>
            <TableHead className="px-6 py-2 text-sm font-semibold text-black">
              Notes
            </TableHead>
            <TableHead className="px-6 py-2 text-sm font-semibold text-black text-right">
              Amount
            </TableHead>
            <TableHead className="px-6 py-2 text-sm font-semibold text-black text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t._id} className="hover:bg-white/5 transition border-b border-zinc-800">

                  {/* Category + Date */}
                  <TableCell className="px-6 py-2 ">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-white">
                        {t.category}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(t.transactionDate).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </span>
                    </div>
                  </TableCell>

                  {/* Account */}
                  <TableCell className="text-gray-300">
                    {t.paymentMethod}
                  </TableCell>

                  {/* Type */}
                  <TableCell>
                    <Badge
                      className={`text-xs ${
                        t.type === "income"
                          ? "bg-lime-400/10 text-lime-400"
                          : "bg-red-400/10 text-red-400"
                      }`}
                    >
                      {t.type}
                    </Badge>
                  </TableCell>

                  {/* Notes */}
                  <TableCell className="text-gray-400 text-sm">
                    {t.note}
                  </TableCell>

                  {/* Amount */}
                  <TableCell className="text-right font-semibold">
                    <span
                      className={
                        t.type === "income"
                          ? "text-lime-400"
                          : "text-red-400"
                      }
                    >
                      {t.type === "income" ? "+" : "-"}₹{t.amount}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">

                      <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-white/10"
                      >
                        <Pencil className="h-4 w-4 text-gray-300" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>

                    </div>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        </div>
        
      
    </DashboardWrapper>
  );
}