import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const user = await User.findById(userId).select("name email");

    const transactions = await Transaction.aggregate([
      { $match: { userId } },

      {
        $facet: {
          summary: [
            {
              $group: {
                _id: "$type",
                total: { $sum: "$amount" }
              }
            }
          ],

          categoryAnalytics: [
            { $match: { type: "expense" } },
            {
              $group: {
                _id: "$category",
                total: { $sum: "$amount" }
              }
            },
            { $sort: { total: -1 } }
          ],

          paymentMethods: [
            { $match: { type: "expense" } },
            {
              $group: {
                _id: "$paymentMethod",
                total: { $sum: "$amount" }
              }
            }
          ],

          monthlyExpenses: [
            { $match: { type: "expense" } },
            {
              $group: {
                _id: { $month: "$transactionDate" },
                total: { $sum: "$amount" }
              }
            },
            { $sort: { "_id": 1 } }
          ],

          transactionCount: [
            {
              $count: "count"
            }
          ]
        }
      }
    ]);

    const summary = transactions[0].summary;

    let income = 0;
    let expense = 0;

    summary.forEach(item => {
      if (item._id === "income") income = item.total;
      if (item._id === "expense") expense = item.total;
    });

    const totalBalance = income - expense;

    res.json({
      user,
      totalBalance,
      monthlyIncome: income,
      monthlyExpense: expense,
      transactionCount:
        transactions[0].transactionCount[0]?.count || 0,

      categoryAnalytics: transactions[0].categoryAnalytics,
      paymentMethods: transactions[0].paymentMethods,
      monthlyExpenses: transactions[0].monthlyExpenses
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};