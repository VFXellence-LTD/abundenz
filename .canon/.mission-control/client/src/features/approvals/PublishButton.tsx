import { useState } from "react";
import type { Approval } from "@/lib/engine";

interface PublishResultItem {
  platform: string;
  status: string;
  dryRun: boolean;
  url?: string;
  message?: string;
}

interface PublishResponse {
  results: PublishResultItem[];
}

export function PublishButton({ approval }: { approval: Approval }) {
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<PublishResultItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Only render for approved video approvals
  if (approval.contentType !== "video" || approval.status !== "approved") {
    return null;
  }

  const handlePublish = async () => {
    setBusy(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvalId: approval.id }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `${res.status} ${res.statusText}`);
      }
      const data = (await res.json()) as PublishResponse;
      setResults(data.results);
    } catch (err) {
      setError(String(err));
    } finally {
      setBusy(false);
    }
  };

  const hasDryRun = results?.some((r) => r.dryRun) ?? false;

  return (
    <div className="mt-3">
      <button
        disabled={busy}
        onClick={handlePublish}
        className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
      >
        {busy ? "Publishing…" : "Publish"}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}

      {results && (
        <div className="mt-2 space-y-1">
          {hasDryRun && (
            <div className="rounded border border-amber-500 bg-amber-950 px-3 py-2 text-sm font-semibold text-amber-300">
              DRY RUN — not actually posted
            </div>
          )}
          {results.map((r, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-zinc-300">
              <span className="font-medium capitalize">{r.platform}</span>
              <span
                className={
                  r.status === "published"
                    ? "text-emerald-400"
                    : r.status === "failed"
                      ? "text-red-400"
                      : "text-zinc-500"
                }
              >
                {r.status}
              </span>
              {r.url && (
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  view
                </a>
              )}
              {r.message && <span className="text-zinc-500">{r.message}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
