"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiterMiddleware = void 0;
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
const redis_1 = __importDefault(require("../config/redis"));
const rateLimiter = new rate_limiter_flexible_1.RateLimiterRedis({
    storeClient: redis_1.default,
    keyPrefix: "rl:api",
    points: 40,
    duration: 60,
    blockDuration: 900,
});
const rateLimiterMiddleware = async (req, res, next) => {
    const key = req.ip || req.body.clientId;
    try {
        await rateLimiter.consume(key);
        next();
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err);
            return next();
        }
        res.status(429).json({
            success: false,
            error: {
                message: "RATE_LIMIT",
                error: "Too many requests, please try again later.",
                statusCode: 429,
            },
        });
    }
};
exports.rateLimiterMiddleware = rateLimiterMiddleware;
//# sourceMappingURL=rate-limiter.js.map