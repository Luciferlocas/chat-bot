import { z } from "zod";
import {
  QueryResponseSchema,
  ConversationSchema,
  MessageSchema,
  ConversationListSchema,
} from ".";

export type QueryResponse = z.infer<typeof QueryResponseSchema>;
export type Conversation = z.infer<typeof ConversationSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type ConversationList = z.infer<typeof ConversationListSchema>;
