import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks";
import { ShoppingBag } from "lucide-react";
import ChatInput from "./input";

export default function ChatPanel() {
  const { messages } = useChat();

  return (
    <div className="w-[380px] h-[520px] max-w-[calc(100vw-3rem)] rounded-2xl shadow-2xl overflow-hidden flex flex-col border">
      <div className="p-3 flex items-center justify-between border-b bg-neutral-900">
        <div className="flex items-center gap-2">
          <ShoppingBag size={20} />
          <h2>Chat Support</h2>
        </div>
      </div>

      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-3 flex flex-col gap-3 w-full">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-2 w-full",
                message.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.sender === "ai" && (
                <div className="rounded-full p-2 bg-neutral-700 w-fit h-fit">
                  <ShoppingBag size={16} />
                </div>
              )}

              <div
                className={cn(
                  "p-2 max-w-[280px] rounded-lg",
                  message.sender === "user"
                    ? "rounded-tr-none bg-neutral-800"
                    : "rounded-tl-none bg-neutral-700"
                )}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <ChatInput />
    </div>
  );
}
