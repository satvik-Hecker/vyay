import express from 'express';
import { register,login } from '../controllers/auth.controller.js';
import { registerValidator, validate, loginValidator, resetPasswordValidator } from '../middlewares/validators/auth.validator.js';
import { authLimiter } from '../middlewares/rateLimit/authLimiter.js';
import { forgotPassword, resetPassword } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/register",authLimiter, registerValidator, validate, register);
router.post('/login',authLimiter, loginValidator,validate,login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPasswordValidator, validate, resetPassword);


export default router;