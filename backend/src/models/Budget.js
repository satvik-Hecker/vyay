import mongoose from "mongoose";

export const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Groceries",
  "Transport",
  "Rent",
  "Utilities",
  "Shopping",
  "Entertainment",
  "Travel",
  "Health",
  "Education",
  "Subscriptions",
  "Other",
];

const BudgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    category: {
      type: String,
      required: true,
      enum: EXPENSE_CATEGORIES,
    },
    amount: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
      default: "",
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    alertAt: {
      type: Number,
      default: 0.8, 
    },
  },
  { timestamps: true }
);

BudgetSchema.index(
  { userId: 1, category: 1, month: 1, year: 1 },
  { unique: true }
);
export default mongoose.model("Budget", BudgetSchema);