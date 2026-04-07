import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import { GoogleGenAI } from "@google/genai";

// Helper for Indian Rupee formatting
const f = (num) => Number(num).toLocaleString('en-IN');

// 1. Initialize the Google GenAI Client
const genAI = new GoogleGenAI({
  apiKey: (process.env.GEMINI_API_KEY || "").trim()
});

export const getAIResponse = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    // --- DATE CALCULATIONS ---
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // --- 2. PARALLEL DATA FETCHING ---
    const [user, last20Transactions, currentStats, lastMonthStats, monthlyAnalytics] = await Promise.all([
      User.findById(userId).select("name").lean(),
      
      // Fetch exactly 20 transactions
      Transaction.find({ userId }).sort({ transactionDate: -1 }).limit(20).lean(),

      // Current Month + Lifetime Stats
      Transaction.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            totalIncome: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
            totalExpense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } },
            monthIncome: { 
              $sum: { $cond: [{ $and: [{ $eq: ["$type", "income"] }, { $gte: ["$transactionDate", startOfCurrentMonth] }] }, "$amount", 0] } 
            },
            monthExpense: { 
              $sum: { $cond: [{ $and: [{ $eq: ["$type", "expense"] }, { $gte: ["$transactionDate", startOfCurrentMonth] }] }, "$amount", 0] } 
            },
          },
        },
      ]),

      // Last Month Stats for Trend Analysis
      Transaction.aggregate([
        { $match: { userId, transactionDate: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
        {
          $group: {
            _id: null,
            lastMonthIncome: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
            lastMonthExpense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } },
          },
        },
      ]),

      // Category Breakdown for current month
      Transaction.aggregate([
        { $match: { userId, type: "expense", transactionDate: { $gte: startOfCurrentMonth } } },
        { $group: { _id: "$category", total: { $sum: "$amount" } } },
        { $sort: { total: -1 } }
      ])
    ]);

    // --- DATA SANITIZATION ---
    const stats = currentStats[0] || { totalIncome: 0, totalExpense: 0, monthIncome: 0, monthExpense: 0 };
    const prevStats = lastMonthStats[0] || { lastMonthIncome: 0, lastMonthExpense: 0 };
    const totalBalance = stats.totalIncome - stats.totalExpense;

    // --- PERCENTAGE CHANGE CALCULATIONS ---
    const getPercentChange = (curr, prev) => {
      if (prev === 0) return curr > 0 ? "+100%" : "0%";
      const diff = ((curr - prev) / prev) * 100;
      return (diff > 0 ? "+" : "") + diff.toFixed(1) + "%";
    };

    const expenseTrend = getPercentChange(stats.monthExpense, prevStats.lastMonthExpense);
    const incomeTrend = getPercentChange(stats.monthIncome, prevStats.lastMonthIncome);

    // --- 3. CONSTRUCT SYSTEM PROMPT ---
   const systemPrompt = `
  You are Vy-AI, the user's witty, financial-genius best friend. Your job is to keep ${user?.name || 'Champ'}'s money game strong.

  PERSONALITY & STYLE (CRITICAL):
  - NO LONG PARAGRAPHS. Max 2-3 short, punchy sentences per message.
  - TONE: Friendly, quirky, and slightly sarcastic. Use casual slang (e.g., "bruh", "vibes", "wallet is sweating", "stonks").
  - FORMATTING: Use **bold** for all currency amounts and numbers. Use emojis to add personality 💸.

  FINANCIAL DATA:
  - Total Balance: ₹${f(totalBalance)}
  - This Month: Income ₹${f(stats.monthIncome)} (${incomeTrend}) | Expenses ₹${f(stats.monthExpense)} (${expenseTrend})
  
  CATEGORY BREAKDOWN:
  ${monthlyAnalytics.length > 0 
    ? monthlyAnalytics.map(c => `- ${c._id}: ₹${f(c.total)}`).join("\n") 
    : "Clean slate! No expenses yet."}
  
  RECENT ACTIVITY:
  ${last20Transactions.map(t => `- ${t.category}: ${t.type === 'income' ? '+' : '-'}₹${f(t.amount)}`).join("\n")}

  AI LOGIC & RESPONSE RULES:
  1. TRENDS: Mention if they are spending more/less than last month (${expenseTrend}). If spending is up, give them a lighthearted "roast."
  2. SAVINGS GOALS: If they want to save for something:
     - Disposable Income = (Monthly Income - Monthly Expense).
     - Timeline = (Goal Amount / Disposable Income). 
     - Tell them the timeline and suggest cutting 10% from their top category (e.g., "${monthlyAnalytics[0]?._id || 'Dining'}").
  3. ROAST VS BOAST: If balance is high, celebrate. If balance is low, warn them like a concerned bro.
`;

   
    // console.log("---------- VYAY AI CONTEXT ----------");
    // console.log(`User: ${user?.name}`);
    // console.log(`Balance: ₹${totalBalance} | Expense Trend: ${expenseTrend}`);
    // console.log(`Transactions Loaded: ${last20Transactions.length}`);
    // console.log(monthlyAnalytics)
    // console.log("-------------------------------------");

    // --- 4. GENERATE RESPONSE ---
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: [{ role: "user", parts: [{ text: message }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    // --- 5. SUCCESS RESPONSE ---
    res.status(200).json({
      success: true,
      answer: result.text,
      data: {
        totalBalance,
        monthlyIncome: stats.monthIncome,
        monthlyExpense: stats.monthExpense,
        trends: { expenseTrend, incomeTrend }
      }
    });

  } catch (error) {
    console.error("VYAY AI ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: "AI Error: " + error.message 
    });
  }
};