import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./src/config/db.js";
import transactionRoutes from './src/routes/transaction.routes.js'
import authRoutes from "./src/routes/auth.routes.js"
import { apiLimiter } from "./src/middlewares/rateLimit/apiLimiter.js";
import dashboardRoutes from "./src/routes/dashboard.routes.js"
import budgetRoutes from "./src/routes/budget.routes.js"
import analyticsRoutes from "./src/routes/analytics.routes.js"

dotenv.config();
console.log("Server file loaded");
const PORT = process.env.PORT || 5000;
const app = express();
connectDB();

//Middlewares
app.use(cors());
app.use(express.json());


//Test route
app.get("/",(req,res)=> {
    res.send("Vyay API running...")
    console.log("Vyay API running...")
})

app.use('/transactions',apiLimiter,transactionRoutes );
app.use('/auth',authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/budgets", budgetRoutes);
app.use("/analytics",analyticsRoutes)

app.listen(PORT,  () => {
  console.log(`vyay server running on ${PORT}`);
});
