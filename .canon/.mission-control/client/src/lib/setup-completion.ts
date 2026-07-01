import type { SetupStep, PlatformAccount, SetupProgress } from "@/types";

export interface CompletionContext {
  accounts: PlatformAccount[];
  progress: SetupProgress;
  brandEmail: string;
}

export function isStepComplete(step: SetupStep, ctx: CompletionContext): boolean {
  if (step.kind === "channel" && step.channelSpec) {
    return step.channelSpec.every((spec) => {
      const acct = ctx.accounts.find((a) => a.platform === spec.platform);
      return acct?.status === "active";
    });
  }
  if (step.writesToBrand === "email") {
    return ctx.brandEmail.trim().length > 0;
  }
  return !!ctx.progress[step.id];
}
