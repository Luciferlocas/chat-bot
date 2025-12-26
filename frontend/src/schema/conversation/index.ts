import { z } from "zod";

export const QueryResponseSchema = z.object({
  conversationId: z.string(),
  message: z.string(),
  clientId: z.string(),
});

export const ConversationListSchema = z.object({
  id: z.string(),
  clientId: z.string(),
  title: z.string(),
  createdAt: z.string(),
  lastActiveAt: z.string(),
});

export const MessageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  sender: z.enum(["ai", "user"]),
  text: z.string(),
  createdAt: z.string(),
});

export const ConversationSchema = z.array(MessageSchema);
