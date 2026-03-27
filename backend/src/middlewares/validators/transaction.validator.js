import { body } from "express-validator";

const categories = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Gift",
  "Pocket Money",
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

export const transactionValidator = [
  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn(["income", "expense"])
    .withMessage("Type must be either income or expense"),

  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a positive number")
    .toFloat(),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .trim()
    .isIn(categories)
    .withMessage("Invalid category"),

  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn(["cash", "bank"])
    .withMessage("Payment method must be cash or bank"),

  body("transactionDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format"),

  body("note")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Note cannot exceed 200 characters"),
];