import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "secondary" | "outline";

const VARIANTS: Record<Variant, string> = {
  default: "bg-emerald-600 text-white border-transparent",
  secondary: "bg-zinc-800 text-zinc-300 border-transparent",
  outline: "bg-transparent text-zinc-400 border-zinc-700",
};

export function Badge({
  children,
  variant = "secondary",
  className,
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-1.5 py-0 text-xs font-medium leading-5",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
