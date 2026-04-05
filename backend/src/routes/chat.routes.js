import express from "express"
import { getAIResponse } from "../controllers/ai.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"

const router = express.Router();
router.post("/", authMiddleware, getAIResponse);

export default router;