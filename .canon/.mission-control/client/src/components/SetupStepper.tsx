import { SetupStep } from "@/components/SetupStep";
import type { SetupStep as SetupStepType } from "@/types";

interface SetupStepperProps {
  steps: SetupStepType[];
  isComplete: (stepId: string) => boolean;
  onToggleStep: (stepId: string) => void;
  locked?: boolean;
  lockedLabel?: string;
  getFieldValue?: (stepId: string, fieldKey: string) => string;
  saveFieldValue?: (stepId: string, fieldKey: string, value: string) => void;
  isSaved?: (stepId: string, fieldKey: string) => boolean;
}

export function SetupStepper({
  steps,
  isComplete,
  onToggleStep,
  locked = false,
  lockedLabel = "Parked",
  getFieldValue,
  saveFieldValue,
  isSaved,
}: SetupStepperProps) {
  if (locked) {
    return (
      <div className="relative">
        <div className="opacity-30 pointer-events-none space-y-3">
          {steps.map((step, i) => (
            <div
              key={step.id}
              className="border border-zinc-800 bg-zinc-900 rounded-lg p-4 flex items-center gap-3"
            >
              <div className="w-7 h-7 rounded-full border-2 border-zinc-600 flex items-center justify-center text-xs font-bold text-zinc-500">
                {i + 1}
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-200">{step.title}</p>
                <p className="text-xs text-zinc-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-zinc-900/95 border border-zinc-700 rounded-xl px-6 py-4 text-center shadow-2xl">
            <p className="text-sm font-semibold text-zinc-300">{lockedLabel}</p>
            <p className="text-xs text-zinc-500 mt-1">Complete Content foundation first</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {steps
        .sort((a, b) => a.order - b.order)
        .map((step, i) => (
          <SetupStep
            key={step.id}
            step={step}
            isComplete={isComplete(step.id)}
            onToggleComplete={() => onToggleStep(step.id)}
            index={i}
            getFieldValue={getFieldValue}
            saveFieldValue={saveFieldValue}
            isSaved={isSaved}
          />
        ))}
    </div>
  );
}
