import { useCallback, useEffect } from "react";
import { useChatStore } from "@/store";
import ChatService from "@/service/chat.service";
import type { Message } from "@/schema/conversation/index.types";

export const useChat = () => {
  const {
    clientId,
    setClientId,
    conversationId,
    setConversationId,
    messages,
    setMessages,
    addMessage,
    isTyping,
    setIsTyping,
  } = useChatStore();

  useEffect(() => {
    if (!clientId) {
      let storedId = localStorage.getItem("clientId");
      if (!storedId) {
        storedId = crypto.randomUUID();
        localStorage.setItem("clientId", storedId);
      }
      setClientId(storedId);
    }
  }, [clientId, setClientId]);

  const sendQuery = async (text: string) => {
    if (!clientId) return;

    setIsTyping(true);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      conversationId: conversationId || "",
      sender: "user",
      text,
      createdAt: new Date().toISOString(),
    };

    addMessage(userMessage);

    try {
      const response = await ChatService.sendMessage(
        text,
        clientId,
        conversationId
      );

      if (response.success && response.data) {
        setConversationId(response.data.conversationId);
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          conversationId: response.data.conversationId,
          sender: "ai",
          text: response.data.message,
          createdAt: new Date().toISOString(),
          isError: response.data.error,
        };
        addMessage(aiMessage);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const loadConversation = async (id: string) => {
    if (!id) return;
    try {
      const response = await ChatService.getConversation(id);
      if (response.success && response.data) {
        setMessages(response.data);
        setConversationId(id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadHistory = useCallback(async () => {
    if (!clientId) return [];
    try {
      const response = await ChatService.getConversationList(clientId);
      if (response.success && response.data) {
        return response.data;
      }
    } catch (error) {
      console.error(error);
    }
    return [];
  }, [clientId]);

  const startNewConversation = () => {
    setConversationId(null);
    setMessages([]);
  };

  return {
    clientId,
    conversationId,
    setConversationId,
    messages,
    setMessages,
    sendQuery,
    isTyping,
    loadConversation,
    loadHistory,
    startNewConversation,
  };
};
