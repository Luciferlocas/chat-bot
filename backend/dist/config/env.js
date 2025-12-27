"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.default = {
    PORT: Number(process.env.PORT),
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    DB_URL: process.env.DATABASE_URL,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    REDIS_URL: process.env.REDIS_URL,
};
//# sourceMappingURL=env.js.map