import { SessionBoard } from "@/components/SessionBoard";

export default function SessionsPage() {
  return (
    <div className="flex h-full flex-col p-6">
      <h1 className="mb-4 text-lg font-semibold text-zinc-100">Sessions</h1>
      <div className="min-h-0 flex-1">
        <SessionBoard />
      </div>
    </div>
  );
}
