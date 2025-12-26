import { useState } from "react";
import ChatPanel from "./panel";
import Trigger from "./trigger";

export default function Widget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
      <div
        className={`
          pointer-events-auto
          transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          origin-bottom-right
          ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-90 translate-y-4 pointer-events-none"
          }
        `}
      >
        <ChatPanel />
      </div>

      <div className="pointer-events-auto">
        <Trigger isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      </div>
    </div>
  );
}
