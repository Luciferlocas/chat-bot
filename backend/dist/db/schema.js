"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesRelations = exports.conversationsRelations = exports.clientsRelations = exports.messages = exports.conversations = exports.clients = exports.senderEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.senderEnum = (0, pg_core_1.pgEnum)("sender", ["user", "ai"]);
exports.clients = (0, pg_core_1.pgTable)("clients", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.conversations = (0, pg_core_1.pgTable)("conversations", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    clientId: (0, pg_core_1.uuid)("client_id")
        .references(() => exports.clients.id, { onDelete: "cascade" })
        .notNull(),
    title: (0, pg_core_1.text)("title"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    lastActiveAt: (0, pg_core_1.timestamp)("last_active_at").defaultNow().notNull(),
    totalTokens: (0, pg_core_1.integer)("total_tokens").default(0).notNull(),
}, (table) => [(0, pg_core_1.index)("conversations_client_idx").on(table.clientId)]);
exports.messages = (0, pg_core_1.pgTable)("messages", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    conversationId: (0, pg_core_1.uuid)("conversation_id")
        .references(() => exports.conversations.id, { onDelete: "cascade" })
        .notNull(),
    sender: (0, exports.senderEnum)("sender").notNull(),
    text: (0, pg_core_1.text)("text").notNull(),
    metadata: (0, pg_core_1.jsonb)("metadata"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
}, (table) => [(0, pg_core_1.index)("messages_conversation_idx").on(table.conversationId)]);
exports.clientsRelations = (0, drizzle_orm_1.relations)(exports.clients, ({ many }) => ({
    conversations: many(exports.conversations),
}));
exports.conversationsRelations = (0, drizzle_orm_1.relations)(exports.conversations, ({ one, many }) => ({
    client: one(exports.clients, {
        fields: [exports.conversations.clientId],
        references: [exports.clients.id],
    }),
    messages: many(exports.messages),
}));
exports.messagesRelations = (0, drizzle_orm_1.relations)(exports.messages, ({ one }) => ({
    conversation: one(exports.conversations, {
        fields: [exports.messages.conversationId],
        references: [exports.conversations.id],
    }),
}));
//# sourceMappingURL=schema.js.map