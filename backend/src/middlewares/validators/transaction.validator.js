import { body } from 'express-validator'

export const transactionValidator = [
    body("type")
    .isIn(["income","expense"])
    .withMessage("Type must be either income or expense"),

    body("amount")
    .isFloat({gt:0})
    .withMessage("Amount must be a positive number"),

    body("category")
    .notEmpty()
    .withMessage("Category is required")
    .trim(),

    body("note")
    .optional()
    .isLength({max:200})
    .withMessage("Note cannot exceed 200 characters"),
];