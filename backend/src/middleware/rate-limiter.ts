import { RateLimiterRedis } from "rate-limiter-flexible";
import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redis";

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rl:api",
  points: 40,
  duration: 60,
  blockDuration: 900,
});

export const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const key = req.ip || req.body.clientId;
  try {
    await rateLimiter.consume(key);
    next();
  } catch (err: any) {
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
