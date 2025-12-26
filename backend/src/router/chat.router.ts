import { Router } from "express";
import { ChatController } from "../controller/chat.contoller";

const router = Router();

router.post("/message", ChatController.message);
router.get("/history/:clientID", ChatController.getHistory);
router.get("/:conversationID", ChatController.getConversation);

export default router;
