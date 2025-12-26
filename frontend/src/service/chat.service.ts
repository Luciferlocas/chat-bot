import type { ClientResponse } from "@/schema/index.types";
import { parseResponse } from "./response-parser";
import type {
  QueryResponse,
  Conversation,
  ConversationList,
} from "@/schema/conversation/index.types";

export default class ChatService {
  private static readonly URL = import.meta.env.VITE_BACKEND_URL;

  static async sendMessage(
    message: string,
    clientId: string,
    conversationId: string | null
  ): Promise<ClientResponse<QueryResponse>> {
    try {
      const response = await fetch(`${this.URL}/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, clientId, conversationId }),
      });
      return parseResponse<QueryResponse>(response);
    } catch (error) {
      console.error(error);
      return {
        success: false,
        data: null,
        error: {
          message: "Failed to send message",
          error: "Failed to send message",
          statusCode: 500,
        },
      };
    }
  }

  static async getConversationList(
    clientId: string
  ): Promise<ClientResponse<ConversationList>> {
    try {
      const response = await fetch(`${this.URL}/chat/history/${clientId}`);
      return parseResponse<ConversationList>(response);
    } catch (error) {
      console.error(error);
      return {
        success: false,
        data: null,
        error: {
          message: "Failed to get chat list",
          error: "Failed to get chat list",
          statusCode: 500,
        },
      };
    }
  }

  static async getConversation(
    conversationId: string
  ): Promise<ClientResponse<Conversation>> {
    try {
      const response = await fetch(`${this.URL}/chat/${conversationId}`);
      return parseResponse<Conversation>(response);
    } catch (error) {
      console.error(error);
      return {
        success: false,
        data: null,
        error: {
          message: "Failed to get conversation",
          error: "Failed to get conversation",
          statusCode: 500,
        },
      };
    }
  }
}
