import mongoose from "mongoose";
import dotenv from "dotenv";
import Transaction from "../models/Transaction.js";
import { transactions } from "./data.js";

dotenv.config();

const userId = new mongoose.Types.ObjectId(
  "69a747410400a0c72db3bb6c"
);

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("DB connected");

    // delete old
    await Transaction.deleteMany({ userId });

    // attach userId
    const data = transactions.map((t) => ({
      ...t,
      userId,
    }));

    await Transaction.insertMany(data);

    console.log("✅ Data seeded");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();