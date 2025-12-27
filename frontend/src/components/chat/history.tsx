import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/hooks";
import { cn, formatDate } from "@/lib/utils";
import type { ConversationList } from "@/schema/conversation/index.types";
import { Calendar, MessageSquare, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export default function ChatHistory({ onSelect }: { onSelect: () => void }) {
  const {
    loadHistory,
    loadConversation,
    conversationId,
    startNewConversation,
  } = useChat();
  const [history, setHistory] = useState<ConversationList>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await loadHistory();
      setHistory(data);
      setLoading(false);
    };
    fetchHistory();
  }, [loadHistory]);

  const handleSelect = async (id: string) => {
    await loadConversation(id);
    onSelect();
  };

  const handleNewChat = () => {
    startNewConversation();
    onSelect();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500 h-full">
        Loading history...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-950">
      <div className="p-3 border-b border-neutral-800">
        <Button
          onClick={handleNewChat}
          className="w-full justify-start gap-2 bg-neutral-800 hover:bg-neutral-700 text-zinc-200"
          variant="ghost"
        >
          <Plus size={16} />
          <span>New Chat</span>
        </Button>
      </div>

      {history.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 gap-2">
          <MessageSquare size={32} />
          <p>No chat history found</p>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="p-3 flex flex-col gap-2">
            {history.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleSelect(chat.id)}
                className={cn(
                  "flex flex-col gap-1 p-3 rounded-lg text-left transition-colors",
                  conversationId === chat.id
                    ? "bg-neutral-800"
                    : "bg-neutral-900/50 hover:bg-neutral-800/50"
                )}
              >
                <h3 className="font-medium text-sm truncate w-full text-zinc-200">
                  {chat.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Calendar size={12} />
                  <span>{formatDate(chat.createdAt)}</span>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
