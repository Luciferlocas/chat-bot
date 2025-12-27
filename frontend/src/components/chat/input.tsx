import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@/hooks";
import { Send } from "lucide-react";
import { useState } from "react";

export default function ChatInput() {
  const { sendQuery, isTyping } = useChat();
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim() || isTyping) return;
    sendQuery(text);
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (text.trim() && !isTyping) {
        sendQuery(text);
        setText("");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex items-end gap-2 p-3 border-t bg-neutral-900"
    >
      <Textarea
        placeholder="Ask your query..."
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 min-h-9 max-h-[100px]"
        disabled={isTyping}
      />
      <Button
        type="submit"
        title="Send query"
        disabled={!text.trim() || isTyping}
        size="icon"
        className="rounded-full"
      >
        <Send />
      </Button>
    </form>
  );
}
