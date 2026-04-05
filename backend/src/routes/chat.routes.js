import express from "express"
import { getAIContextAndChat } from "../controllers/ai.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"

const router = express.Router();
router.post("/", authMiddleware, getAIContextAndChat);

export default router;