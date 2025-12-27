"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversationSchema = exports.getHistorySchema = exports.chatMessageSchema = void 0;
const zod_1 = require("zod");
exports.chatMessageSchema = zod_1.z.object({
    clientId: zod_1.z.string().uuid(),
    conversationId: zod_1.z.string().uuid().nullable(),
    message: zod_1.z
        .string()
        .trim()
        .min(1, "Message cannot be empty")
        .max(2000, "Message too long"),
});
exports.getHistorySchema = zod_1.z.object({
    clientID: zod_1.z.string().uuid(),
});
exports.getConversationSchema = zod_1.z.object({
    conversationID: zod_1.z.string().uuid(),
});
//# sourceMappingURL=chat.schema.js.map