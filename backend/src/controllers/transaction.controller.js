import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";


// ✅ CREATE TRANSACTION
export const createTransaction = async (req, res) => {
  try {
    const {
      type,
      amount,
      category,
      paymentMethod,
      note,
      transactionDate,
    } = req.body;

    if (!type || !amount || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const transaction = await Transaction.create({
      userId: req.user.userId,
      type,
      amount,
      category,
      paymentMethod,
      note,
      transactionDate: transactionDate || new Date(),
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ GET TRANSACTIONS (FILTER + SEARCH + SORT + PAGINATION)
export const getTransactions = async (req, res) => {
  try {
    const {
      category,
      type,
      paymentMethod,
      startDate,
      endDate,
      search,
      sort = "latest",
      page = 1,
      limit = 10,
    } = req.query;

    const filter = { userId: req.user.userId };

    // filters
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (paymentMethod) filter.paymentMethod = paymentMethod;

    // date filter
    if (startDate || endDate) {
      filter.transactionDate = {};
      if (startDate) filter.transactionDate.$gte = new Date(startDate);
      if (endDate) filter.transactionDate.$lte = new Date(endDate);
    }

    // 🔍 search
    if (search) {
      filter.$or = [
        { note: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    // 🔄 sorting
    let sortOption = { transactionDate: -1 };

    if (sort === "oldest") sortOption = { transactionDate: 1 };
    if (sort === "amount_high") sortOption = { amount: -1 };
    if (sort === "amount_low") sortOption = { amount: 1 };

    const skip = (page - 1) * limit;

    const totalTransactions = await Transaction.countDocuments(filter);

    const transactions = await Transaction.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      page: Number(page),
      limit: Number(limit),
      totalTransactions,
      totalPages: Math.ceil(totalTransactions / limit),
      transactions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ UPDATE TRANSACTION
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Transaction.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ DELETE TRANSACTION
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      userId: req.user.userId,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ STATS (FILTER-AWARE, DASHBOARD READY)
export const getStats = async (req, res) => {
  try {
    const { startDate, endDate, category, type } = req.query;

    const matchStage = {
      userId: new mongoose.Types.ObjectId(req.user.userId),
    };

    // optional filters (important for UX consistency)
    if (category) matchStage.category = category;
    if (type) matchStage.type = type;

    if (startDate || endDate) {
      matchStage.transactionDate = {};
      if (startDate) matchStage.transactionDate.$gte = new Date(startDate);
      if (endDate) matchStage.transactionDate.$lte = new Date(endDate);
    }

    const stats = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
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
          transactions: { $sum: 1 },
        },
      },
    ]);

    const income = stats[0]?.income || 0;
    const expense = stats[0]?.expense || 0;

    res.json({
      totalBalance: income - expense,
      income,
      expense,
      transactions: stats[0]?.transactions || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ EXPENSE ANALYTICS (CATEGORY BREAKDOWN)
export const getExpenseAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const matchStage = {
      userId: new mongoose.Types.ObjectId(req.user.userId),
      type: "expense",
    };

    if (startDate || endDate) {
      matchStage.transactionDate = {};
      if (startDate) matchStage.transactionDate.$gte = new Date(startDate);
      if (endDate) matchStage.transactionDate.$lte = new Date(endDate);
    }

    const analytics = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          total: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};