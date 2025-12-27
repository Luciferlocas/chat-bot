import { Router } from "express";
import { ChatController } from "../controller/chat.contoller";
import { rateLimiterMiddleware } from "../middleware/rate-limiter";

const router = Router();

router.post("/message", rateLimiterMiddleware, ChatController.message);
router.get("/history/:clientID", ChatController.getHistory);
router.get("/:conversationID", ChatController.getConversation);

export default router;
