"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = __importDefault(require("../config/env"));
const redisClient = new ioredis_1.default(env_1.default.REDIS_URL, {
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
exports.default = redisClient;
//# sourceMappingURL=redis.js.map