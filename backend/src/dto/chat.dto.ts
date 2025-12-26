import { eq, asc, desc } from "drizzle-orm";
import db from "../db";
import { clients, conversations, messages } from "../db/schema";

export class ChatDto {
  static async getClient(clientId: string) {
    const existingClient = await db
      .select()
      .from(clients)
      .where(eq(clients.id, clientId))
      .limit(1);
    return existingClient[0] || null;
  }

  static async createClient(clientId: string) {
    const [newClient] = await db
      .insert(clients)
      .values({ id: clientId })
      .returning();
    return newClient;
  }

  static async getConversation(conversationId: string) {
    const existingConversation = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);
    return existingConversation[0] || null;
  }

  static async createConversation(clientId: string) {
    const [newConv] = await db
      .insert(conversations)
      .values({
        clientId: clientId,
      })
      .returning();
    return newConv;
  }

  static async createMessage(
    conversationId: string,
    sender: "user" | "ai",
    text: string
  ) {
    const [msg] = await db
      .insert(messages)
      .values({
        conversationId,
        sender,
        text,
      })
      .returning();
    return msg;
  }

  static async updateConversationTitle(conversationId: string, title: string) {
    await db
      .update(conversations)
      .set({ title })
      .where(eq(conversations.id, conversationId));
  }

  static async updateConversationLastActive(conversationId: string) {
    await db
      .update(conversations)
      .set({ lastActiveAt: new Date() })
      .where(eq(conversations.id, conversationId));
  }

  static async getMessagesByConversationId(conversationId: string) {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(asc(messages.createdAt));
  }

  static async getConversationsByClientId(clientId: string) {
    return await db
      .select()
      .from(conversations)
      .where(eq(conversations.clientId, clientId))
      .orderBy(desc(conversations.lastActiveAt));
  }
}
