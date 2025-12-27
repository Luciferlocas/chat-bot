import { create } from "zustand";
import type { Conversation } from "@/schema/index.types";

interface ChatStore {
  clientId: string | null;
  setClientId: (clientId: string) => void;
  conversationId: string | null;
  setConversationId: (conversationId: string | null) => void;
  messages: Conversation;
  setMessages: (messages: Conversation) => void;
  addMessage: (message: Conversation[number]) => void;
  isTyping: boolean;
  setIsTyping: (isTyping: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  clientId: null,
  setClientId: (clientId) => set({ clientId }),
  conversationId: null,
  setConversationId: (conversationId) => set({ conversationId }),
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  isTyping: false,
  setIsTyping: (isTyping) => set({ isTyping }),
}));
