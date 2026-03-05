import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const result = await Transaction.aggregate([
      {
        $match: { userId }
      },

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
          ]

        }
      }
    ]);

    res.json(result[0]);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};