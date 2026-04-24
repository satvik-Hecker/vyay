import rateLimit from "express-rate-limit";

export const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: {
        message: "Too many password reset attempts. Please try again after an hour."
    },
    standardHeaders: true,
    legacyHeaders: false
});
