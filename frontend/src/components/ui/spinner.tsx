import * as React from "react";
import { cn } from "@/lib/utils";

const Spinner = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const bars = [
    "bg-zinc-200",
    "bg-zinc-300",
    "bg-zinc-400",
    "bg-zinc-500",
    "bg-zinc-600",
    "bg-zinc-700",
    "bg-zinc-800",
    "bg-zinc-900",
  ];

  return (
    <div
      ref={ref}
      className={cn("relative inline-block animate-spin w-4 h-4", className)}
      {...props}
    >
      {bars.map((bg, index) => (
        <span
          key={index}
          className={cn("absolute w-[3px] rounded-full h-[6px]", bg)}
          style={{
            transform: `rotate(${index * 45}deg) translateY(-9px)`,
            top: "50%",
            left: "50%",
            transformOrigin: "0 0",
          }}
        >
          <span className="sr-only">Loading...</span>
        </span>
      ))}
    </div>
  );
});

Spinner.displayName = "Spinner";

export { Spinner };
