import { Inbox } from "lucide-react";
import { IntakeForm } from "@/features/intake/IntakeForm";

export function IntakePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Inbox className="h-5 w-5 text-emerald-400" />
        <h1 className="text-2xl font-bold text-zinc-100">Intake</h1>
      </div>
      <p className="text-sm text-zinc-500">Spin up a campaign with its tasks, register a brand, or file an improvement to Mission Control itself.</p>
      <IntakeForm />
    </div>
  );
}
