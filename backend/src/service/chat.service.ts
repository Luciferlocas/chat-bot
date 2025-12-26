import { ChatMessage } from "../schema/chat.schema";
import { ChatDto } from "../dto/chat.dto";
import { LLMService } from "./llm.service";

export class ChatService {
  static async handleMessage(data: ChatMessage) {
    const { clientId, conversationId, message } = data;
    let currentConversationId = conversationId;

    let client = await ChatDto.getClient(clientId);
    if (!client) {
      client = await ChatDto.createClient(clientId);
    }

    let conversation;
    if (currentConversationId) {
      conversation = await ChatDto.getConversation(currentConversationId);
    }

    if (!conversation) {
      conversation = await ChatDto.createConversation(clientId);
      currentConversationId = conversation.id;
    }

    await ChatDto.createMessage(conversation.id, "user", message);
    if (!conversation.title) {
      const generatedTitle =
        message.length > 40 ? message.substring(0, 37) + "..." : message;

      await ChatDto.updateConversationTitle(conversation.id, generatedTitle);
    }
    await ChatDto.updateConversationLastActive(conversation.id);

    try {
      const rawHistory = await ChatDto.getMessagesByConversationId(
        conversation.id
      );
      const historyForAI = rawHistory.slice(0, -1).map((msg) => ({
        role: (msg.sender === "user" ? "user" : "model") as "user" | "model",
        parts: [{ text: msg.text }],
      }));

      const { text, metadata } = await LLMService.generateReply(
        historyForAI,
        message
      );

      await ChatDto.createMessage(conversation.id, "ai", text);
      await ChatDto.updateConversationLastActive(conversation.id);

      return {
        conversationId: conversation.id,
        message: text,
        clientId: clientId,
      };
    } catch (error) {
      return {
        conversationId: conversation.id,
        message:
          "I'm having trouble connecting right now. Please try again later.",
        clientId: clientId,
        error: true,
      };
    }
  }

  static async getHistory(clientId: string) {
    return await ChatDto.getConversationsByClientId(clientId);
  }

  static async getConversation(conversationId: string) {
    return await ChatDto.getMessagesByConversationId(conversationId);
  }
}
