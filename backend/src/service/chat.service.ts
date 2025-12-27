import { ChatMessage } from "../schema/chat.schema";
import { ChatDto } from "../dto/chat.dto";
import { LLMService } from "./llm.service";

export class ChatService {
  static async handleMessage(data: ChatMessage) {
    const { clientId, conversationId, message } = data;
    const MAX_TOKENS = 100000;
    const MAX_MESSAGES = 100;
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

    const messageCount = await ChatDto.getMessagesByConversationId(
      conversation.id
    );
    if (
      conversation.totalTokens >= MAX_TOKENS ||
      messageCount.length >= MAX_MESSAGES
    ) {
      return {
        conversationId: conversation.id,
        message:
          "This conversation has reached its maximum limit. Please start a new chat.",
        clientId: clientId,
        error: true,
      };
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

      const inputTokens = metadata.tokenUsage?.promptTokenCount || 0;
      const outputTokens = metadata.tokenUsage?.candidatesTokenCount || 0;
      const totalUsed = inputTokens + outputTokens;

      const newTotalTokens = (conversation.totalTokens || 0) + totalUsed;

      await ChatDto.createMessage(conversation.id, "ai", text, metadata);
      await ChatDto.updateConversationLastActive(conversation.id);
      await ChatDto.updateConversationTokens(conversation.id, newTotalTokens);

      return {
        conversationId: conversation.id,
        message: text,
        clientId: clientId,
      };
    } catch (error: any) {
      let errormsg =
        "I'm having trouble connecting right now. Please try again later.";

      if (error.message === "INVALID_API_KEY") {
        errormsg =
          "We are experiencing some technical issues. The service is temporarily unavailable. Please check back later.";
      } else if (
        error.message === "RATE_LIMIT" ||
        error.message === "SERVICE_OVERLOAD"
      ) {
        errormsg =
          "It is taking longer than expected to process your request due to high traffic. Please try again later.";
      }

      return {
        conversationId: conversation.id,
        message: errormsg,
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
