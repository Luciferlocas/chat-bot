import { Button } from "@/components/ui/button";
import { ShoppingBag, X } from "lucide-react";

export default function Trigger({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      size="icon-lg"
      className="rounded-full"
      title="AI Assistant"
    >
      {isOpen ? <X className="size-5" /> : <ShoppingBag className="size-5" />}
    </Button>
  );
}
