import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const user = await User.findById(userId).select("name email");

    const now = new Date();

    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const transactions = await Transaction.aggregate([
      { $match: { userId } },

      {
        $facet: {
          
          thisMonth: [
            { $match: { transactionDate: { $gte: startOfThisMonth } } },
            {
              $group: {
                _id: "$type",
                total: { $sum: "$amount" }
              }
            }
          ],

          
          lastMonth: [
            {
              $match: {
                transactionDate: {
                  $gte: startOfLastMonth,
                  $lte: endOfLastMonth
                }
              }
            },
            {
              $group: {
                _id: "$type",
                total: { $sum: "$amount" }
              }
            }
          ],

          
          transactionCount: [
            { $count: "count" }
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
          ]
        }
      }
    ]);

    
    const getValue = (arr, type) =>
      arr.find((i) => i._id === type)?.total || 0;

    const thisMonth = transactions[0].thisMonth;
    const lastMonth = transactions[0].lastMonth;

    const income = getValue(thisMonth, "income");
    const expense = getValue(thisMonth, "expense");

    const lastIncome = getValue(lastMonth, "income");
    const lastExpense = getValue(lastMonth, "expense");

    const totalBalance = income - expense;

    
    const calcChange = (current, prev) => {
      if (prev === 0) return current === 0 ? 0 : 100;
      return ((current - prev) / prev) * 100;
    };

    res.json({
      user,

      stats: {
        totalBalance,
        income,
        expense,
        transactions:
          transactions[0].transactionCount[0]?.count || 0,

        changes: {
          balance: calcChange(totalBalance, lastIncome - lastExpense),
          income: calcChange(income, lastIncome),
          expense: calcChange(expense, lastExpense),
          transactions: 0 // (optional: can compute later)
        }
      },

      categoryAnalytics: transactions[0].categoryAnalytics
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};