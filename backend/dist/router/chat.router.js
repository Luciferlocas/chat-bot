"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_contoller_1 = require("../controller/chat.contoller");
const rate_limiter_1 = require("../middleware/rate-limiter");
const router = (0, express_1.Router)();
router.post("/message", rate_limiter_1.rateLimiterMiddleware, chat_contoller_1.ChatController.message);
router.get("/history/:clientID", chat_contoller_1.ChatController.getHistory);
router.get("/:conversationID", chat_contoller_1.ChatController.getConversation);
exports.default = router;
//# sourceMappingURL=chat.router.js.map