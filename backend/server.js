import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./src/config/db.js";
import transactionRoutes from './src/routes/transaction.routes.js'
import authRoutes from "./src/routes/auth.routes.js"

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

app.use('/transactions',transactionRoutes);
app.use('/auth',authRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`vyay server running on ${PORT}`);
});
