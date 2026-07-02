import { cn } from "@/lib/utils";
import { StepShell } from "@/components/StepShell";
import type { SetupStep as SetupStepType } from "@/types";

interface SetupStepProps {
  step: SetupStepType;
  isComplete: boolean;
  onToggleComplete: () => void;
  index: number;
  expanded: boolean;
  onToggleExpand: () => void;
  getFieldValue?: (stepId: string, fieldKey: string) => string;
  saveFieldValue?: (stepId: string, fieldKey: string, value: string) => void;
  setLocal?: (stepId: string, fieldKey: string, value: string) => void;
  isSaved?: (stepId: string, fieldKey: string) => boolean;
}

export function SetupStep({ step, isComplete, onToggleComplete, index, expanded, onToggleExpand, getFieldValue, saveFieldValue, setLocal, isSaved }: SetupStepProps) {
  return (
    <StepShell step={step} isComplete={isComplete} onToggleComplete={onToggleComplete} index={index} expanded={expanded} onToggleExpand={onToggleExpand}>
      {step.fields && step.fields.length > 0 && getFieldValue && saveFieldValue && setLocal && (
        <div className="space-y-3">
          {step.fields.map((field) => {
            const inputCls = "w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500";
            return (
              <div key={field.key}>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-xs text-zinc-500">{field.label}</label>
                  {isSaved?.(step.id, field.key) && <span className="text-xs text-emerald-500">saved ✓</span>}
                </div>
                {field.type === "textarea" ? (
                  <textarea rows={2} className={cn(inputCls, "resize-y")} value={getFieldValue(step.id, field.key)} placeholder={field.placeholder}
                    onChange={(e) => setLocal(step.id, field.key, e.target.value)} onBlur={(e) => saveFieldValue(step.id, field.key, e.target.value)} />
                ) : (
                  <input type={field.type === "url" ? "url" : field.type === "email" ? "email" : "text"} className={inputCls}
                    value={getFieldValue(step.id, field.key)} placeholder={field.placeholder}
                    onChange={(e) => setLocal(step.id, field.key, e.target.value)} onBlur={(e) => saveFieldValue(step.id, field.key, e.target.value)} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </StepShell>
  );
}
