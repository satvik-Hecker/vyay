import express from "express";
import {
  createTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
  getStats,
  getExpenseAnalytics,
} from "../controllers/transaction.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import { transactionValidator } from "../middlewares/validators/transaction.validator.js";
import { validate } from "../middlewares/validators/auth.validator.js";

const router = express.Router();

// 🔒 protect all routes
router.use(authMiddleware);

// ✅ STATS (keep ABOVE /:id routes)
router.get("/stats", getStats);

// ✅ ANALYTICS
router.get("/analytics", getExpenseAnalytics);

// ✅ CREATE
router.post("/", transactionValidator, validate, createTransaction);

// ✅ GET ALL (filters + search + pagination)
router.get("/", getTransactions);

// ✅ UPDATE
router.put("/:id", updateTransaction);

// ✅ DELETE
router.delete("/:id", deleteTransaction);

export default router;