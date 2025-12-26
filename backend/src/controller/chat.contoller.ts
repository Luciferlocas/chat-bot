import { Request, Response } from "express";
import {
  chatMessageSchema,
  getHistorySchema,
  getConversationSchema,
} from "../schema/chat.schema";
import { ChatService } from "../service/chat.service";

export class ChatController {
  static async message(req: Request, res: Response) {
    try {
      const parsed = chatMessageSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          error: parsed.error.flatten(),
        });
      }

      const result = await ChatService.handleMessage(parsed.data);
      return res.status(200).json(result);
    } catch (err) {
      console.error("ChatController error:", err);
      return res.status(500).json({
        error: "Something went wrong. Please try again.",
      });
    }
  }

  static async getHistory(req: Request, res: Response) {
    try {
      const parsed = getHistorySchema.safeParse(req.params);

      if (!parsed.success) {
        return res.status(400).json({
          error: parsed.error.flatten(),
        });
      }

      const history = await ChatService.getHistory(parsed.data.clientID);
      return res.status(200).json(history);
    } catch (err) {
      console.error("ChatController getHistory error:", err);
      return res.status(500).json({ error: "Failed to fetch history" });
    }
  }

  static async getConversation(req: Request, res: Response) {
    try {
      const parsed = getConversationSchema.safeParse(req.params);

      if (!parsed.success) {
        return res.status(400).json({
          error: parsed.error.flatten(),
        });
      }

      const messages = await ChatService.getConversation(parsed.data.conversationID);
      return res.status(200).json(messages);
    } catch (err) {
      console.error("ChatController getConversation error:", err);
      return res.status(500).json({ error: "Failed to fetch conversation" });
    }
  }
}
