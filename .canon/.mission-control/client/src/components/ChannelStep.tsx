import { StepShell } from "@/components/StepShell";
import type { SetupStep, PlatformAccount, AccountFieldTarget } from "@/types";

interface ChannelStepProps {
  step: SetupStep;
  accounts: PlatformAccount[];
  updateAccount: (id: number, data: Partial<Record<AccountFieldTarget, string> & { status: PlatformAccount["status"] }>) => void;
  isComplete: boolean;
  onToggleComplete: () => void;
  index: number;
  expanded: boolean;
  onToggleExpand: () => void;
}

const inputCls =
  "w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500";

export function ChannelStep({ step, accounts, updateAccount, isComplete, onToggleComplete, index, expanded, onToggleExpand }: ChannelStepProps) {
  const specs = step.channelSpec ?? [];
  const labelFor = (fieldKey: string) => step.fields?.find((f) => f.key === fieldKey)?.label ?? fieldKey;
  const placeholderFor = (fieldKey: string) => step.fields?.find((f) => f.key === fieldKey)?.placeholder;

  return (
    <StepShell step={step} isComplete={isComplete} onToggleComplete={onToggleComplete} index={index} expanded={expanded} onToggleExpand={onToggleExpand}>
      <div className="space-y-4">
        {specs.map((spec) => {
          const acct = accounts.find((a) => a.platform === spec.platform);
          if (!acct || acct.id === undefined) {
            return (
              <p key={spec.platform} className="text-xs text-zinc-500">
                No account for <span className="text-zinc-400">{spec.platform}</span> yet — it is seeded when the brand is created.
              </p>
            );
          }
          return (
            <div key={spec.platform} className="space-y-3">
              {specs.length > 1 && <p className="text-xs font-medium text-zinc-400">{spec.platform}</p>}
              {spec.fields.map((f) => (
                <div key={f.fieldKey}>
                  <label htmlFor={`${step.id}-${spec.platform}-${f.fieldKey}`} className="mb-1 block text-xs text-zinc-500">
                    {labelFor(f.fieldKey)}
                  </label>
                  <input
                    id={`${step.id}-${spec.platform}-${f.fieldKey}`}
                    aria-label={labelFor(f.fieldKey)}
                    className={inputCls}
                    defaultValue={(acct[f.accountField] as string | undefined) ?? ""}
                    placeholder={placeholderFor(f.fieldKey)}
                    onBlur={(e) => updateAccount(acct.id!, { [f.accountField]: e.target.value, status: "active" })}
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </StepShell>
  );
}
