import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

const f = (num) => Number(num).toLocaleString('en-IN');

export const getAIContextAndChat = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 1. Parallel Data Fetching
    const [user, last20Transactions, globalStats, monthlyAnalytics] = await Promise.all([
      User.findById(userId).select("name"),

      // A. Last 20 Transactions (Granular details for AI)
      Transaction.find({ userId })
        .sort({ transactionDate: -1 })
        .limit(20)
        .lean(),

      // B. Total Balance (Lifetime calculation) + Monthly Totals
      Transaction.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            totalIncome: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
            totalExpense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } },
            monthIncome: { 
              $sum: { $cond: [{ $and: [{ $eq: ["$type", "income"] }, { $gte: ["$transactionDate", startOfMonth] }] }, "$amount", 0] } 
            },
            monthExpense: { 
              $sum: { $cond: [{ $and: [{ $eq: ["$type", "expense"] }, { $gte: ["$transactionDate", startOfMonth] }] }, "$amount", 0] } 
            },
          },
        },
      ]),

      // C. Category Breakdown (Current Month only)
      Transaction.aggregate([
        { 
          $match: { 
            userId, 
            type: "expense", 
            transactionDate: { $gte: startOfMonth } 
          } 
        },
        { $group: { _id: "$category", total: { $sum: "$amount" } } },
        { $sort: { total: -1 } }
      ])
    ]);

    const stats = globalStats[0] || { totalIncome: 0, totalExpense: 0, monthIncome: 0, monthExpense: 0 };
    const totalBalance = stats.totalIncome - stats.totalExpense;

    // 2. Construct the "Financial Brain" String
    const financialContext = `
      USER: ${user?.name || 'User'}
      
      FINANCIAL SNAPSHOT:
      - TOTAL BALANCE: ₹${f(totalBalance)} (Lifetime)
      - THIS MONTH INCOME: ₹${f(stats.monthIncome)}
      - THIS MONTH EXPENSE: ₹${f(stats.monthExpense)}
      
      CATEGORY BREAKDOWN (THIS MONTH):
      ${monthlyAnalytics.length > 0 
        ? monthlyAnalytics.map(c => `- ${c._id}: ₹${f(c.total)}`).join("\n") 
        : "No expenses recorded this month."}
      
      LAST 20 TRANSACTIONS:
      ${last20Transactions.map(t => `- ${t.transactionDate.toISOString().split('T')[0]}: ${t.type === 'income' ? '+' : '-'}${f(t.amount)} | ${t.category} | Note: ${t.note || 'N/A'}`).join("\n")}
    `;

    // 3. The System Instruction
    const systemPrompt = `
      You are Vyay AI, a financial expert for the "Vyay" app. 
      Use the following context to provide advice and answer questions accurately.
      
      Context:
      ${financialContext}

      Instructions:
      1. Reference specific categories if the user asks where their money is going.
      2. If the monthly expense is higher than the monthly income, offer a gentle saving tip.
      3. Be concise, professional, and helpful.
    `;

    // 4. Response
    res.status(200).json({
      success: true,
      systemInstruction: systemPrompt,
      // Sending raw data too in case you want to use it for UI charts in the chat
      data: {
        totalBalance,
        monthlyIncome: stats.monthIncome,
        monthlyExpense: stats.monthExpense,
        categoryBreakdown: monthlyAnalytics,
        recentTransactions: last20Transactions
      }
    });

  } catch (error) {
    console.error("Vyay AI Error:", error);
    res.status(500).json({ message: "Internal Server Error in AI Controller" });
  }
};