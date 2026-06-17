import { useState } from "react";
import { Bug } from "lucide-react";
import { cn } from "@/lib/utils";

type Area =
  | "mission-control"
  | "server"
  | "dashboard-client"
  | "polymath-engine"
  | "governance"
  | "automation";

type Severity = "critical" | "high" | "medium" | "low";

const AREAS: Area[] = [
  "mission-control",
  "server",
  "dashboard-client",
  "polymath-engine",
  "governance",
  "automation",
];

const SEVERITIES: Severity[] = ["critical", "high", "medium", "low"];

interface BugReportResponse {
  url: string;
  dryRun: boolean;
}

export function BugReportButton() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [area, setArea] = useState<Area>("mission-control");
  const [severity, setSeverity] = useState<Severity>("medium");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<BugReportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setTitle("");
    setDescription("");
    setArea("mission-control");
    setSeverity("medium");
    setResult(null);
    setError(null);
    setBusy(false);
  }

  function handleClose() {
    setOpen(false);
    reset();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/bug-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description, area, severity }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `${res.status} ${res.statusText}`);
      }
      const data = (await res.json()) as BugReportResponse;
      setResult(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setBusy(false);
    }
  }

  const inputCls =
    "w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500";
  const labelCls = "mb-1 block text-xs text-zinc-500";

  return (
    <>
      {/* Trigger button — sits in the sidebar footer */}
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-zinc-600 hover:text-zinc-400 hover:bg-zinc-900 transition-colors"
      >
        <Bug className="w-3.5 h-3.5 flex-shrink-0" />
        Report bug
      </button>

      {/* Modal backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
              <div className="flex items-center gap-2">
                <Bug className="w-4 h-4 text-red-400" />
                <h2 className="text-sm font-semibold text-zinc-100">Report a bug</h2>
              </div>
              <button
                onClick={handleClose}
                className="text-zinc-600 hover:text-zinc-300 text-lg leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4">
              {result ? (
                /* Success state */
                <div className="space-y-3">
                  {result.dryRun && (
                    <div className="rounded border border-amber-500 bg-amber-950 px-3 py-2 text-sm font-semibold text-amber-300">
                      DRY RUN — issue not actually filed (enable MC_BUG_REPORT_ENABLED)
                    </div>
                  )}
                  <p className="text-sm text-zinc-300">
                    {result.dryRun ? "Would have filed:" : "Issue filed:"}
                  </p>
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block truncate text-sm text-blue-400 hover:underline"
                  >
                    {result.url}
                  </a>
                  <button
                    onClick={handleClose}
                    className="mt-2 rounded-md bg-zinc-700 px-4 py-1.5 text-sm font-medium text-zinc-200 hover:bg-zinc-600"
                  >
                    Close
                  </button>
                </div>
              ) : (
                /* Form state */
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className={labelCls}>Title *</label>
                    <input
                      className={inputCls}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Brief description of the bug"
                      required
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Description</label>
                    <textarea
                      rows={3}
                      className={cn(inputCls, "resize-y")}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Steps to reproduce, expected vs actual…"
                    />
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className={labelCls}>Area</label>
                      <select
                        className={inputCls}
                        value={area}
                        onChange={(e) => setArea(e.target.value as Area)}
                      >
                        {AREAS.map((a) => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className={labelCls}>Severity</label>
                      <select
                        className={inputCls}
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value as Severity)}
                      >
                        {SEVERITIES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {error && (
                    <p className="text-sm text-red-400">{error}</p>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="rounded-md px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={busy || !title.trim()}
                      className="rounded-md bg-red-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
                    >
                      {busy ? "Filing…" : "File bug"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
