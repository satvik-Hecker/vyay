import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
    windowMs: 15*60*1000, //15 mints
    max: 100, //100 req per window per IP
    message: {
        message: "Too many requests, try again later."
    },
    standardHeaders:true,
    legacyHeaders:false
});