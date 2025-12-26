import { useEffect } from "react";
import { useChatStore } from "@/store";
import ChatService from "@/service/chat.service";

export const useChat = () => {
  const {
    clientId,
    setClientId,
    conversationId,
    setConversationId,
    messages,
    setMessages,
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
    try {
      const response = await ChatService.sendMessage(
        text,
        clientId,
        conversationId
      );

      if (response.success) {
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    clientId,
    conversationId,
    setConversationId,
    messages,
    setMessages,
    sendQuery,
  };
};
