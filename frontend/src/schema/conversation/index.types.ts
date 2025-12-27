import { z } from "zod";
import {
  QueryResponseSchema,
  ConversationSchema,
  MessageSchema,
  ConversationListSchema,
  ConversationItemSchema,
} from ".";

export type QueryResponse = z.infer<typeof QueryResponseSchema>;
export type Conversation = z.infer<typeof ConversationSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type ConversationList = z.infer<typeof ConversationListSchema>;
export type ConversationItem = z.infer<typeof ConversationItemSchema>;
