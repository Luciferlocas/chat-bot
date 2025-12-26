import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Send } from "lucide-react";
import { useChat } from "@/hooks";

export default function ChatInput() {
  const { sendQuery } = useChat();
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendQuery(text);
    setText("");
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
        className="flex-1 min-h-9 max-h-[100px]"
      />
      <Button
        type="submit"
        title="Send query"
        disabled={!text.trim()}
        size="icon"
        className="rounded-full"
      >
        <Send />
      </Button>
    </form>
  );
}
