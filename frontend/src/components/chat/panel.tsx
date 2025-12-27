import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/hooks";
import { cn } from "@/lib/utils";
import { History, ShoppingBag, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import MarkDown from "react-markdown";
import { Button } from "../ui/button";
import ChatHistory from "./history";
import ChatInput from "./input";

export default function ChatPanel() {
  const { messages, isTyping } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (!showHistory) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, showHistory]);

  return (
    <div className="w-[380px] h-[520px] max-w-[calc(100vw-3rem)] rounded-2xl shadow-2xl overflow-hidden flex flex-col border bg-neutral-950 relative">
      <div className="p-3 flex items-center justify-between border-b bg-neutral-900 z-30 relative">
        <div className="flex items-center gap-2">
          <ShoppingBag size={20} />
          <h2>Chat Support</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-zinc-400 hover:text-white"
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? <X size={20} /> : <History size={20} />}
        </Button>
      </div>

      <div className="flex-1 relative overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex-1 h-full flex flex-col items-center justify-center gap-2 text-zinc-500 min-h-[400px]">
              <div className="p-4 bg-neutral-900 rounded-full">
                <ShoppingBag size={32} />
              </div>
              <p className="text-sm">Start by asking your query</p>
            </div>
          ) : (
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
                      "p-2 max-w-[280px] rounded-lg text-sm",
                      message.sender === "user"
                        ? "rounded-tr-none bg-neutral-800"
                        : "rounded-tl-none bg-neutral-700",
                      message.isError &&
                        "bg-red-900/50 text-red-200 border border-red-800/50"
                    )}
                  >
                    <MarkDown>{message.text}</MarkDown>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2 w-full justify-start">
                  <div className="rounded-full p-2 bg-neutral-700 w-fit h-fit">
                    <ShoppingBag size={16} />
                  </div>
                  <p className="rounded-lg rounded-tl-none p-2 bg-neutral-700 animate-pulse text-sm">Typing...</p>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          )}
        </ScrollArea>

        <ChatInput />

        <div
          className={cn(
            "absolute inset-0 bg-neutral-950 z-20 transition-transform duration-300 ease-in-out flex flex-col",
            showHistory ? "translate-y-0" : "-translate-y-full"
          )}
        >
          <ChatHistory onSelect={() => setShowHistory(false)} />
        </div>
      </div>
    </div>
  );
}
