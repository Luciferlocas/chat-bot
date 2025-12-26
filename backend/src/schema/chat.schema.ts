import { z } from "zod";

export const chatMessageSchema = z.object({
  clientId: z.string().uuid(),
  conversationId: z.string().uuid().optional(),
  message: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(2000, "Message too long"),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

export const getHistorySchema = z.object({
  clientID: z.string().uuid(),
});

export const getConversationSchema = z.object({
  conversationID: z.string().uuid(),
});
