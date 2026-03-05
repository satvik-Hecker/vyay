import { body } from 'express-validator'

const categories=  [
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
"Other"
]

export const transactionValidator = [
    body("type")
    .isIn(["income","expense"])
    .withMessage("Type must be either income or expense"),

    body("amount")
    .isFloat({gt:0})
    .withMessage("Amount must be a positive number"),

    body("category")
    .trim()
    .isIn(categories)
    .withMessage("Invalid category"),
    

    body("paymentMethod")
    .trim()
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn(["cash","bank"])
    .withMessage("Payment method must be cash or bank"),

    body("transactionDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format"),

    body("note")
    .trim()
    .optional()
    .isLength({max:200})
    .withMessage("Note cannot exceed 200 characters")
    .escape()
];