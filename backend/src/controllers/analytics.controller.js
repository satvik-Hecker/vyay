import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";

export const getCurrentMonthAnalytics = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const now = new Date();
    
    // 1. Time Boundaries for Current Month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysPassed = now.getDate() || 1; // Prevent division by zero on day 1

    // 2. Fetch Data (Aggregating Categories & Total in one go)
    const categoryData = await Transaction.aggregate([
      { 
        $match: { 
          userId, 
          type: "expense", 
          transactionDate: { $gte: startOfMonth, $lte: now } 
        } 
      },
      { 
        $group: { 
          _id: "$category", 
          total: { $sum: "$amount" } 
        } 
      },
      { $sort: { total: -1 } }
    ]);

    // 3. Calculate Totals and Rate
    const totalSpent = categoryData.reduce((sum, item) => sum + item.total, 0);
    const dailyPace = totalSpent / daysPassed;
    const projectedEndTotal = dailyPace * daysInMonth;

    // 4. Format for Frontend
    const formattedCategories = categoryData.map(c => ({
      name: c._id,
      value: c.total
    }));

    res.status(200).json({
      success: true,
      data: {
        currentMonth: now.toLocaleString('default', { month: 'long' }),
        totalSpent,
        spendingRatePerDay: parseFloat(dailyPace.toFixed(2)),
        projectedEndTotal: parseFloat(projectedEndTotal.toFixed(2)),
        categories: formattedCategories
      }
    });

  } catch (error) {
    console.error("[Analytics] Error:", error);
    res.status(500).json({ success: false, message: "Failed to load analytics." });
  }
};