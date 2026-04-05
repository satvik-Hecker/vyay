import express from "express";
import { createOrUpdateBudget, getBudgets } from "../controllers/budget.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// create / update budget
router.use(authMiddleware)
router.post("/", createOrUpdateBudget);
router.get("/", getBudgets);

export default router;