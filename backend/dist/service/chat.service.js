"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const chat_dto_1 = require("../dto/chat.dto");
const llm_service_1 = require("./llm.service");
class ChatService {
    static async handleMessage(data) {
        const { clientId, conversationId, message } = data;
        const MAX_TOKENS = 100000;
        const MAX_MESSAGES = 100;
        let currentConversationId = conversationId;
        let client = await chat_dto_1.ChatDto.getClient(clientId);
        if (!client) {
            client = await chat_dto_1.ChatDto.createClient(clientId);
        }
        let conversation;
        if (currentConversationId) {
            conversation = await chat_dto_1.ChatDto.getConversation(currentConversationId);
        }
        if (!conversation) {
            conversation = await chat_dto_1.ChatDto.createConversation(clientId);
            currentConversationId = conversation.id;
        }
        const messageCount = await chat_dto_1.ChatDto.getMessagesByConversationId(conversation.id);
        if (conversation.totalTokens >= MAX_TOKENS ||
            messageCount.length >= MAX_MESSAGES) {
            return {
                conversationId: conversation.id,
                message: "This conversation has reached its maximum limit. Please start a new chat.",
                clientId: clientId,
                error: true,
            };
        }
        await chat_dto_1.ChatDto.createMessage(conversation.id, "user", message);
        if (!conversation.title) {
            const generatedTitle = message.length > 40 ? message.substring(0, 37) + "..." : message;
            await chat_dto_1.ChatDto.updateConversationTitle(conversation.id, generatedTitle);
        }
        await chat_dto_1.ChatDto.updateConversationLastActive(conversation.id);
        try {
            const rawHistory = await chat_dto_1.ChatDto.getMessagesByConversationId(conversation.id);
            const historyForAI = rawHistory.slice(0, -1).map((msg) => ({
                role: (msg.sender === "user" ? "user" : "model"),
                parts: [{ text: msg.text }],
            }));
            const { text, metadata } = await llm_service_1.LLMService.generateReply(historyForAI, message);
            const inputTokens = metadata.tokenUsage?.promptTokenCount || 0;
            const outputTokens = metadata.tokenUsage?.candidatesTokenCount || 0;
            const totalUsed = inputTokens + outputTokens;
            const newTotalTokens = (conversation.totalTokens || 0) + totalUsed;
            await chat_dto_1.ChatDto.createMessage(conversation.id, "ai", text, metadata);
            await chat_dto_1.ChatDto.updateConversationLastActive(conversation.id);
            await chat_dto_1.ChatDto.updateConversationTokens(conversation.id, newTotalTokens);
            return {
                conversationId: conversation.id,
                message: text,
                clientId: clientId,
            };
        }
        catch (error) {
            let errormsg = "I'm having trouble connecting right now. Please try again later.";
            if (error.message === "INVALID_API_KEY") {
                errormsg =
                    "We are experiencing some technical issues. The service is temporarily unavailable. Please check back later.";
            }
            else if (error.message === "RATE_LIMIT" ||
                error.message === "SERVICE_OVERLOAD") {
                errormsg =
                    "It is taking longer than expected to process your request due to high traffic. Please try again later.";
            }
            return {
                conversationId: conversation.id,
                message: errormsg,
                clientId: clientId,
                error: true,
            };
        }
    }
    static async getHistory(clientId) {
        return await chat_dto_1.ChatDto.getConversationsByClientId(clientId);
    }
    static async getConversation(conversationId) {
        return await chat_dto_1.ChatDto.getMessagesByConversationId(conversationId);
    }
}
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map