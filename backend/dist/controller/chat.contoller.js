"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const chat_schema_1 = require("../schema/chat.schema");
const chat_service_1 = require("../service/chat.service");
class ChatController {
    static async message(req, res) {
        try {
            const parsed = chat_schema_1.chatMessageSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    error: parsed.error.flatten(),
                });
            }
            const result = await chat_service_1.ChatService.handleMessage(parsed.data);
            return res.status(200).json(result);
        }
        catch (err) {
            console.error("ChatController error:", err);
            return res.status(500).json({
                error: "Something went wrong. Please try again.",
            });
        }
    }
    static async getHistory(req, res) {
        try {
            const parsed = chat_schema_1.getHistorySchema.safeParse(req.params);
            if (!parsed.success) {
                return res.status(400).json({
                    error: parsed.error.flatten(),
                });
            }
            const history = await chat_service_1.ChatService.getHistory(parsed.data.clientID);
            return res.status(200).json(history);
        }
        catch (err) {
            console.error("ChatController getHistory error:", err);
            return res.status(500).json({ error: "Failed to fetch history" });
        }
    }
    static async getConversation(req, res) {
        try {
            const parsed = chat_schema_1.getConversationSchema.safeParse(req.params);
            if (!parsed.success) {
                return res.status(400).json({
                    error: parsed.error.flatten(),
                });
            }
            const messages = await chat_service_1.ChatService.getConversation(parsed.data.conversationID);
            return res.status(200).json(messages);
        }
        catch (err) {
            console.error("ChatController getConversation error:", err);
            return res.status(500).json({ error: "Failed to fetch conversation" });
        }
    }
}
exports.ChatController = ChatController;
//# sourceMappingURL=chat.contoller.js.map