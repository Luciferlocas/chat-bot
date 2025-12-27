import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  index,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

export const senderEnum = pgEnum("sender", ["user", "ai"]);

export const clients = pgTable("clients", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clientId: uuid("client_id")
      .references(() => clients.id, { onDelete: "cascade" })
      .notNull(),
    title: text("title"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    lastActiveAt: timestamp("last_active_at").defaultNow().notNull(),
    totalTokens: integer("total_tokens").default(0).notNull(),
  },
  (table) => [index("conversations_client_idx").on(table.clientId)]
);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    conversationId: uuid("conversation_id")
      .references(() => conversations.id, { onDelete: "cascade" })
      .notNull(),
    sender: senderEnum("sender").notNull(),
    text: text("text").notNull(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },

  (table) => [index("messages_conversation_idx").on(table.conversationId)]
);

export const clientsRelations = relations(clients, ({ many }) => ({
  conversations: many(conversations),
}));

export const conversationsRelations = relations(
  conversations,
  ({ one, many }) => ({
    client: one(clients, {
      fields: [conversations.clientId],
      references: [clients.id],
    }),
    messages: many(messages),
  })
);

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
