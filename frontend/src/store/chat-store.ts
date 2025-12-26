import { create } from "zustand";
import type { Conversation } from "@/schema/index.types";

interface ChatStore {
  clientId: string | null;
  setClientId: (clientId: string) => void;
  conversationId: string | null;
  setConversationId: (conversationId: string | null) => void;
  messages: Conversation;
  setMessages: (messages: Conversation) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  clientId: null,
  setClientId: (clientId) => set({ clientId }),
  conversationId: null,
  setConversationId: (conversationId) => set({ conversationId }),
  messages: [],
  setMessages: (messages) => set({ messages }),
}));
