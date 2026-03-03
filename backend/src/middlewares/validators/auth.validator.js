import { body, validationResult } from 'express-validator';

export const registerValidator = [
    body("name")
    .notEmpty()
    .withMessage("Name is required")
    .trim(),

    body("email")
    .isEmail()
    .withMessage("Valid email id required")
    .normalizeEmail(),

    body("password")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
    .withMessage(
    "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
  ),
];

export const loginValidator = [
    body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),

    body("password")
    .notEmpty()
    .withMessage("Password can not be empty.")
];

export const validate = (req,res,next)=> {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array(),
        });
    }
    next();
};