"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatDto = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../db"));
const schema_1 = require("../db/schema");
class ChatDto {
    static async getClient(clientId) {
        const existingClient = await db_1.default
            .select()
            .from(schema_1.clients)
            .where((0, drizzle_orm_1.eq)(schema_1.clients.id, clientId))
            .limit(1);
        return existingClient[0] || null;
    }
    static async createClient(clientId) {
        const [newClient] = await db_1.default
            .insert(schema_1.clients)
            .values({ id: clientId })
            .returning();
        return newClient;
    }
    static async getConversation(conversationId) {
        const existingConversation = await db_1.default
            .select()
            .from(schema_1.conversations)
            .where((0, drizzle_orm_1.eq)(schema_1.conversations.id, conversationId))
            .limit(1);
        return existingConversation[0] || null;
    }
    static async createConversation(clientId) {
        const [newConv] = await db_1.default
            .insert(schema_1.conversations)
            .values({
            clientId: clientId,
        })
            .returning();
        return newConv;
    }
    static async createMessage(conversationId, sender, text, metadata) {
        const [msg] = await db_1.default
            .insert(schema_1.messages)
            .values({
            conversationId,
            sender,
            text,
            metadata,
        })
            .returning();
        return msg;
    }
    static async updateConversationTitle(conversationId, title) {
        await db_1.default
            .update(schema_1.conversations)
            .set({ title })
            .where((0, drizzle_orm_1.eq)(schema_1.conversations.id, conversationId));
    }
    static async updateConversationLastActive(conversationId) {
        await db_1.default
            .update(schema_1.conversations)
            .set({ lastActiveAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.conversations.id, conversationId));
    }
    static async updateConversationTokens(conversationId, totalTokens) {
        await db_1.default
            .update(schema_1.conversations)
            .set({ totalTokens: totalTokens })
            .where((0, drizzle_orm_1.eq)(schema_1.conversations.id, conversationId));
    }
    static async getMessagesByConversationId(conversationId) {
        return await db_1.default
            .select()
            .from(schema_1.messages)
            .where((0, drizzle_orm_1.eq)(schema_1.messages.conversationId, conversationId))
            .orderBy((0, drizzle_orm_1.asc)(schema_1.messages.createdAt));
    }
    static async getConversationsByClientId(clientId) {
        return await db_1.default
            .select()
            .from(schema_1.conversations)
            .where((0, drizzle_orm_1.eq)(schema_1.conversations.clientId, clientId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.conversations.lastActiveAt));
    }
}
exports.ChatDto = ChatDto;
//# sourceMappingURL=chat.dto.js.map