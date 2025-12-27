"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = __importDefault(require("../config/env"));
const node_postgres_1 = require("drizzle-orm/node-postgres");
const db = (0, node_postgres_1.drizzle)(env_1.default.DB_URL);
exports.default = db;
//# sourceMappingURL=index.js.map