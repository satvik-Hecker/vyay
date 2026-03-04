import express from 'express';
import { register,login } from '../controllers/auth.controller.js';
import { registerValidator, validate, loginValidator } from '../middlewares/validators/auth.validator.js';
import { authLimiter } from '../middlewares/rateLimit/authLimiter.js';

const router = express.Router();

router.post("/register",authLimiter, registerValidator, validate, register);
router.post('/login',authLimiter, loginValidator,validate,login);


export default router;