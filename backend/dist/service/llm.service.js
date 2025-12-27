"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMService = void 0;
const generative_ai_1 = require("@google/generative-ai");
const env_1 = __importDefault(require("../config/env"));
const genAI = new generative_ai_1.GoogleGenerativeAI(env_1.default.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    systemInstruction: `You are a helpful and friendly customer support agent, a modern e-commerce store specializing in tech gadgets.

Use the following knowledge base to answer customer queries clearly and concisely:

1. **Shipping Policy:**
   - Free standard shipping on all orders over $50.
   - Standard shipping takes 3-5 business days.
   - Express shipping (1-2 business days) is available for a flat fee of $15.
   - We currently ship to the US, Canada, and UK.

2. **Return & Refund Policy:**
   - We accept returns within 30 days of purchase.
   - Items must be unused and in original packaging.
   - Refunds are processed to the original payment method within 5-7 business days after we receive the return.
   - Return shipping costs are the customer's responsibility unless the item is defective or incorrect.

3. **Support Hours:**
   - Live Chat/Phone: Monday - Friday, 9:00 AM - 6:00 PM EST.
   - Email Support: Available 24/7 with a response time of up to 24 hours.

4. **Payment Options:**
   - We accept Visa, MasterCard, American Express, PayPal, and Apple Pay.

5. **Order Tracking:**
   - A tracking number will be emailed to you as soon as your order ships.

**Important Rule:**
If a customer asks a question that is NOT covered by this knowledge base (e.g., specific technical troubleshooting not related to sales, status of a specific order ID you can't access, or policy exceptions), do NOT make up an answer. Instead, politely say:
"I don't have that information right now. Please contact our support team directly at support@technova.com for further assistance."`,
});
class LLMService {
    static async generateReply(history, userMessage) {
        try {
            const chat = model.startChat({
                history: history,
                generationConfig: {
                    maxOutputTokens: 1000,
                },
            });
            const result = await chat.sendMessage(userMessage);
            const response = result.response;
            return {
                text: response.text(),
                metadata: {
                    finishReason: response.candidates?.[0]?.finishReason,
                    tokenUsage: result.response.usageMetadata,
                },
            };
        }
        catch (error) {
            console.error("Gemini API Error:", error);
            const errorMessage = error.message || error.toString();
            if (errorMessage.includes("API key")) {
                throw new Error("INVALID_API_KEY");
            }
            if (errorMessage.includes("429") || errorMessage.includes("quota")) {
                throw new Error("RATE_LIMIT");
            }
            if (errorMessage.includes("503") || errorMessage.includes("overloaded")) {
                throw new Error("SERVICE_OVERLOAD");
            }
            throw new Error("GENERIC_AI_ERROR");
        }
    }
}
exports.LLMService = LLMService;
//# sourceMappingURL=llm.service.js.map