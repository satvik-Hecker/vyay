import express from "express"
import { getCurrentMonthAnalytics } from "../controllers/analytics.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"

const router = express.Router()
router.get("/current-month",authMiddleware,getCurrentMonthAnalytics)
export default router