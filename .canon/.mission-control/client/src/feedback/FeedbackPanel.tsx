import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { useFeedback } from "@/feedback/FeedbackProvider";

interface FeedbackItemResult { url: string; dryRun: boolean; }
interface FeedbackBatchResponse { results: FeedbackItemResult[]; }

export function FeedbackPanel() {
  const { items, panelOpen, add, remove, clear, openPanel, closePanel } = useFeedback();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<FeedbackItemResult[] | null>(null);

  const inputCls =
    "w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500";

  function handleAdd() {
    if (!text.trim()) return;
    add({ text: text.trim() });
    setText("");
    setResults(null);
  }

  async function handleSubmitAll() {
    if (items.length === 0) return;
    setBusy(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `${res.status} ${res.statusText}`);
      }
      const data = (await res.json()) as FeedbackBatchResponse;
      setResults(data.results);
      clear();
    } catch (err) {
      setError(String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Floating launcher */}
      <button
        onClick={openPanel}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg hover:bg-emerald-500"
      >
        <MessageSquarePlus className="h-4 w-4" />
        Feedback{items.length > 0 ? ` (${items.length})` : ""}
      </button>

      {panelOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={(e) => { if (e.target === e.currentTarget) closePanel(); }}
        >
          <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
              <h2 className="text-sm font-semibold text-zinc-100">Improve Mission Control</h2>
              <button onClick={closePanel} className="text-lg leading-none text-zinc-600 hover:text-zinc-300" aria-label="Close">×</button>
            </div>
            <div className="space-y-3 px-5 py-4">
              <div className="flex gap-2">
                <input
                  className={inputCls}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAdd(); } }}
                  placeholder="What would make this better?"
                  autoFocus
                />
                <button
                  onClick={handleAdd}
                  disabled={!text.trim()}
                  className="rounded-md bg-zinc-700 px-3 py-1.5 text-sm text-zinc-200 hover:bg-zinc-600 disabled:opacity-50"
                >
                  Add
                </button>
              </div>

              {items.length > 0 ? (
                <ul className="max-h-60 space-y-1.5 overflow-y-auto">
                  {items.map((it, i) => (
                    <li key={i} className="flex items-start gap-2 rounded border border-zinc-800 bg-zinc-950 px-3 py-2">
                      <span className="flex-1 text-sm text-zinc-300">{it.text}</span>
                      <button onClick={() => remove(i)} className="text-sm text-zinc-600 hover:text-red-400" aria-label="Remove">×</button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-zinc-600">No feedback yet. Add items above; they accumulate until you submit.</p>
              )}

              {results && (
                <div className="space-y-2">
                  {results.some((r) => r.dryRun) && (
                    <div className="rounded border border-amber-500 bg-amber-950 px-3 py-2 text-sm font-semibold text-amber-300">
                      DRY RUN — issues not actually filed (enable MC_FEEDBACK_ENABLED)
                    </div>
                  )}
                  <p className="text-sm text-zinc-300">{results.length} item(s) processed:</p>
                  <ul className="space-y-1">
                    {results.map((r, i) => (
                      <li key={i}>
                        <a href={r.url} target="_blank" rel="noopener noreferrer" className="block truncate text-sm text-blue-400 hover:underline">{r.url}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {error && <p className="text-sm text-red-400">{error}</p>}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button onClick={closePanel} className="rounded-md px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-300">Done</button>
                <button
                  onClick={handleSubmitAll}
                  disabled={busy || items.length === 0}
                  className="rounded-md bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
                >
                  {busy ? "Filing…" : `Submit all${items.length ? ` (${items.length})` : ""}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
