import { ChevronDown, ChevronRight, Check, ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/CopyButton";
import type { SetupStep as SetupStepType } from "@/types";

interface StepShellProps {
  step: SetupStepType;
  isComplete: boolean;
  onToggleComplete: () => void;
  index: number;
  expanded: boolean;
  onToggleExpand: () => void;
  children?: ReactNode; // field inputs (setup_data or account-bound)
}

export function StepShell({ step, isComplete, onToggleComplete, index, expanded, onToggleExpand, children }: StepShellProps) {
  return (
    <div className={cn("border rounded-lg transition-colors", isComplete ? "border-zinc-700 bg-zinc-900/50" : "border-zinc-800 bg-zinc-900")}>
      <div className="flex items-center gap-3 p-4">
        <button
          onClick={onToggleComplete}
          className={cn(
            "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors",
            isComplete ? "bg-emerald-500 border-emerald-500 text-white" : "border-zinc-600 text-zinc-500 hover:border-zinc-400"
          )}
        >
          {isComplete ? <Check className="w-3.5 h-3.5" /> : <span>{index + 1}</span>}
        </button>
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm font-medium", isComplete ? "text-zinc-500 line-through" : "text-zinc-200")}>{step.title}</p>
          {!expanded && <p className="text-xs text-zinc-500 mt-0.5 truncate">{step.description}</p>}
        </div>
        <button onClick={onToggleExpand} className="flex-shrink-0 text-zinc-500 hover:text-zinc-300 transition-colors">
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-zinc-800 pt-4 ml-10 space-y-4">
          <p className="text-sm text-zinc-400 leading-relaxed">{step.instructions}</p>

          {children}

          {step.copyBlocks && step.copyBlocks.length > 0 && (
            <div className="space-y-3">
              {step.copyBlocks.map((block, i) => (
                <div key={i} className="rounded-md bg-zinc-950 border border-zinc-800">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800">
                    <span className="text-xs font-medium text-zinc-400">{block.label}</span>
                    <CopyButton text={block.content} />
                  </div>
                  <pre className="text-xs text-zinc-300 p-3 whitespace-pre-wrap leading-relaxed font-mono">{block.content}</pre>
                </div>
              ))}
            </div>
          )}

          {step.externalLinks && step.externalLinks.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {step.externalLinks.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-zinc-800 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700 transition-colors">
                  {link.label}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
