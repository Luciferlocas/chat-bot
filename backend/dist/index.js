"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = __importDefault(require("./config/env"));
const router_1 = __importDefault(require("./router"));
const app = (0, express_1.default)();
const PORT = env_1.default.PORT;
async function bootstrap() {
    try {
        app.set("trust proxy", 1);
        app.use(express_1.default.json());
        app.use((0, cors_1.default)({
            origin: env_1.default.CORS_ORIGIN,
        }));
        app.use("/api", router_1.default);
        app.get("/", (req, res) => {
            res.send("Hello World!");
        });
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to bootstrap", error);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=index.js.map