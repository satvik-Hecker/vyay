import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

// Helper to format currency/numbers for the AI string
const f = (num) => Number(num).toLocaleString('en-IN');

export const getAIContextAndChat = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysPassed = now.getDate() || 1;
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    // 1. Parallel Data Fetching (Reusing your controller logic)
    const [user, transactions, statsResult, categoryData] = await Promise.all([
      User.findById(userId).select("name"),
      
      // Last 30 days of transactions for context
      Transaction.find({ 
        userId, 
        transactionDate: { $gte: new Date(now.setDate(now.getDate() - 30)) } 
      }).sort({ transactionDate: -1 }).limit(20).lean(),

      // Aggregated totals for Balance, Income, Expense
      Transaction.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            income: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
            expense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } },
            cash: { $sum: { $cond: [{ $and: [{$eq: ["$paymentMethod", "cash"]}, {$eq: ["$type", "income"]}] }, "$amount", { $cond: [{$eq: ["$paymentMethod", "cash"]}, { $subtract: [0, "$amount"] }, 0] }] } },
            bank: { $sum: { $cond: [{ $and: [{$eq: ["$paymentMethod", "bank"]}, {$eq: ["$type", "income"]}] }, "$amount", { $cond: [{$eq: ["$paymentMethod", "bank"]}, { $subtract: [0, "$amount"] }, 0] }] } },
          },
        },
      ]),

      // Current Month Analytics
      Transaction.aggregate([
        { $match: { userId, type: "expense", transactionDate: { $gte: startOfMonth } } },
        { $group: { _id: "$category", total: { $sum: "$amount" } } },
        { $sort: { total: -1 } }
      ])
    ]);

    const stats = statsResult[0] || { income: 0, expense: 0, cash: 0, bank: 0 };
    const totalSpentThisMonth = categoryData.reduce((sum, item) => sum + item.total, 0);
    const dailyPace = totalSpentThisMonth / daysPassed;
    const projection = dailyPace * daysInMonth;

    // 2. Construct the AI's "Financial Brain"
    // We convert the data into a readable string format for the System Prompt
    const financialContext = `
      USER: ${user?.name || 'User'}
      
      FINANCIAL SUMMARY:
      - Total Balance: ₹${f(stats.cash + stats.bank)} (Bank: ₹${f(stats.bank)}, Cash: ₹${f(stats.cash)})
      - Monthly Income: ₹${f(stats.income)}
      - Monthly Expense: ₹${f(stats.expense)}
      
      ANALYTICS (CURRENT MONTH):
      - Total Spent: ₹${f(totalSpentThisMonth)}
      - Burning Rate: ₹${f(dailyPace)}/day
      - Projected End-of-Month Expense: ₹${f(projection)}
      - Top Categories: ${categoryData.slice(0, 3).map(c => `${c._id} (₹${f(c.total)})`).join(", ")}
      
      RECENT TRANSACTIONS (Last 30 Days):
      ${transactions.map(t => `- ${t.transactionDate.toISOString().split('T')[0]}: ${t.type === 'income' ? '+' : '-'}${f(t.amount)} | ${t.category} | Note: ${t.note || 'N/A'}`).join("\n")}
    `;

    // 3. System Prompt for the LLM
    const systemPrompt = `
      You are Vyay AI, a helpful and smart financial assistant for the app "Vyay". 
      Your goal is to provide insights based on the user's data. 
      
      Rules:
      1. Use the provided "FINANCIAL SUMMARY" and "ANALYTICS" to answer questions.
      2. If a user is overspending (check Burning Rate vs Income), gently warn them.
      3. Be concise but insightful.
      4. If asked about a specific transaction, look into the "RECENT TRANSACTIONS" list.
      5. Your tone should be encouraging but realistic.
      
      CONTEXT:
      ${financialContext}
    `;

    // 4. Return to Frontend
    // Note: You will need to pass 'systemPrompt' to your Gemini/OpenAI API call here
    res.status(200).json({
      success: true,
      systemInstruction: systemPrompt, // Send this to your LLM
      dataFeed: { stats, projection, categoryData } // Optional: for UI sync
    });

  } catch (error) {
    console.error("AI Context Error:", error);
    res.status(500).json({ message: "Failed to prepare Vyay AI context" });
  }
};