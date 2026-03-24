import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const user = await User.findById(userId).select("name email");

    const now = new Date();

    // ---------- DATE RANGES ----------
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const last7Days = new Date();
    last7Days.setDate(now.getDate() - 6);

    startOfThisMonth.setHours(0, 0, 0, 0);
    startOfLastMonth.setHours(0, 0, 0, 0);
    endOfLastMonth.setHours(23, 59, 59, 999);
    last7Days.setHours(0, 0, 0, 0);

    // ---------- FETCH DATA ----------
    const [currentMonthTxn, lastMonthTxn, last7DaysTxn] = await Promise.all([
      Transaction.find({
        userId,
        transactionDate: { $gte: startOfThisMonth },
      }).lean(),

      Transaction.find({
        userId,
        transactionDate: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      }).lean(),

      Transaction.find({
        userId,
        transactionDate: { $gte: last7Days },
      }).lean(),
    ]);

    // ---------- CALCULATE STATS ----------
    const calcStats = (txns) => {
      let income = 0;
      let expense = 0;

      txns.forEach((t) => {
        if (t.type === "income") income += t.amount;
        else expense += t.amount;
      });

      return {
        income,
        expense,
        balance: income - expense,
        transactions: txns.length,
      };
    };

    const currentStats = calcStats(currentMonthTxn);
    const lastStats = calcStats(lastMonthTxn);

    // ---------- % CHANGE ----------
    const calcChange = (curr, last) => {
      if (last === 0) return curr === 0 ? 0 : 100;
      return Math.round(((curr - last) / last) * 100);
    };

    // ---------- DATE FORMAT ----------
    const formatDate = (date) => {
      const d = new Date(date);
      return d.toISOString().split("T")[0];
    };

    // ---------- WEEKLY SPENDING ----------
    const weeklyMap = {};

    last7DaysTxn.forEach((t) => {
      if (t.type !== "expense") return;

      const key = formatDate(t.transactionDate);

      if (!weeklyMap[key]) weeklyMap[key] = 0;
      weeklyMap[key] += t.amount;
    });

    const weeklySpending = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);

      const key = formatDate(d);

      weeklySpending.push({
        date: key,
        amount: weeklyMap[key] || 0,
      });
    }

    // ---------- RECENT ----------
    const recentTransactions = await Transaction.find({ userId })
      .sort({ transactionDate: -1 })
      .limit(5);

    // ---------- CASH vs BANK (REAL BALANCE) ----------
    const balanceResult = await Transaction.aggregate([
      {
        $match: { userId },
      },
      {
        $group: {
          _id: "$paymentMethod",
          income: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
            },
          },
        },
      },
    ]);

    let cash = 0;
    let bank = 0;

    balanceResult.forEach((item) => {
      const balance = item.income - item.expense;

      if (item._id === "cash") {
        cash = balance;
      } else if (item._id === "bank") {
        bank = balance;
      }
    });

    // 🔥 REAL TOTAL BALANCE
    const totalBalance = cash + bank;

    // ---------- RESPONSE ----------
    res.json({
      user,

      stats: {
        totalBalance: totalBalance, // ✅ FIXED
        income: currentStats.income,
        expense: currentStats.expense,
        transactions: currentStats.transactions,
        changes: {
          balance: calcChange(currentStats.balance, lastStats.balance),
          income: calcChange(currentStats.income, lastStats.income),
          expense: calcChange(currentStats.expense, lastStats.expense),
          transactions: calcChange(
            currentStats.transactions,
            lastStats.transactions
          ),
        },
      },

      weeklySpending,

      cashVsBalance: {
        cash,
        bank,
      },

      recentTransactions: recentTransactions.map((tx) => ({
        _id: tx._id,
        category: tx.category,
        amount: tx.amount,
        type: tx.type,
        transactionDate: tx.transactionDate,
      })),
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: error.message });
  }
};