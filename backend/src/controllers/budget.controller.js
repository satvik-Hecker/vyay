import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";

export const createOrUpdateBudget = async (req, res) => {
  try {
    const userId = req.user?.userId;

        if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
        }
    const { category, amount, note, month, year } = req.body;

    // basic validation
    if (!category || !amount || !month || !year) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const budget = await Budget.findOneAndUpdate(
      { userId, category, month, year },
      {
        amount,
        note: note || "",
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.json(budget);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const getBudgets = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year required" });
    }

    // 🔥 convert to ObjectId (VERY IMPORTANT)
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // 1. Get budgets
    const budgets = await Budget.find({
      userId: userObjectId,
      month: Number(month),
      year: Number(year),
    });

    // 2. Get total spending per category
    const spends = await Transaction.aggregate([
      {
        $match: {
          userId: userObjectId,
          type: "expense", // ⚠️ change if your data uses "Expense"
          createdAt: {     // 🔥 FIXED (was date)
            $gte: new Date(year, month - 1, 1),
            $lte: new Date(year, month, 0),
          },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    // DEBUG (remove later)
    console.log("SPENDS:", spends);

    // 3. Convert to map
    const spendMap = {};
    spends.forEach((s) => {
      spendMap[s._id] = s.total;
    });

    // 4. Merge budgets + spending
    const result = budgets.map((b) => {
      const spent = spendMap[b.category] || 0;
      const progress = spent / b.amount;

      let status = "safe";
      if (progress >= 1) status = "exceeded";
      else if (progress >= b.alertAt) status = "warning";

      return {
        category: b.category,
        budget: b.amount,
        spent,
        remaining: b.amount - spent,
        progress,
        status,
      };
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};