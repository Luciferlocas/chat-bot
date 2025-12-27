import Redis from "ioredis";
import config from "../config/env";

const redisClient = new Redis(config.REDIS_URL!, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
});

redisClient.on("ready", () => {
  console.log("Redis connected");
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

redisClient.on("close", () => {
  console.warn("Redis connection closed");
});

redisClient.on("reconnecting", () => {
  console.warn("Redis reconnecting...");
});

export default redisClient;
