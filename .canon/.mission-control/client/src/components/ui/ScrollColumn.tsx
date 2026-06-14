import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ScrollColumn({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-y-auto", className)}>
      {children}
    </div>
  );
}
