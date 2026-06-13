import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ECOSYSTEMS, REVENUE_STREAMS, EXPENSE_STREAMS } from "@/data/ecosystems";
import type { NewTransaction } from "@/hooks/useTransactions";
import type { EcosystemId, StreamId, TransactionType } from "@/types";

interface TransactionFormProps {
  onSubmit: (data: NewTransaction) => void;
  onClose: () => void;
  initial?: Partial<NewTransaction>;
}

const today = new Date().toISOString().slice(0, 10);

export function TransactionForm({ onSubmit, onClose, initial }: TransactionFormProps) {
  const [form, setForm] = useState<NewTransaction>({
    date: initial?.date ?? today,
    amount: initial?.amount ?? 0,
    ecosystemId: initial?.ecosystemId ?? "content",
    stream: initial?.stream ?? "com",
    description: initial?.description ?? "",
    type: initial?.type ?? "income",
  });

  const streams = form.type === "income" ? REVENUE_STREAMS : EXPENSE_STREAMS;

  const set = <K extends keyof NewTransaction>(key: K, value: NewTransaction[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      // Reset stream when switching type to avoid invalid stream
      if (key === "type") {
        const defaultStream = value === "income" ? "com" : "subscriptions";
        next.stream = defaultStream as StreamId;
      }
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description.trim() || form.amount <= 0) return;
    onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <h2 className="font-semibold text-zinc-100">Add Transaction</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Type toggle */}
          <div className="flex rounded-lg bg-zinc-950 p-1 gap-1">
            {(["income", "expense"] as TransactionType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => set("type", t)}
                className={cn(
                  "flex-1 py-1.5 rounded text-sm font-medium capitalize transition-colors",
                  form.type === t
                    ? t === "income"
                      ? "bg-emerald-600 text-white"
                      : "bg-red-600 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-500 block mb-1.5">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500"
                required
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-1.5">Amount (USD)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={form.amount || ""}
                onChange={(e) => set("amount", parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-500 block mb-1.5">Ecosystem</label>
              <select
                value={form.ecosystemId}
                onChange={(e) => set("ecosystemId", e.target.value as EcosystemId)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500"
              >
                {ECOSYSTEMS.map((eco) => (
                  <option key={eco.id} value={eco.id}>
                    {eco.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-1.5">Stream</label>
              <select
                value={form.stream}
                onChange={(e) => set("stream", e.target.value as StreamId)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500"
              >
                {streams.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-zinc-500 block mb-1.5">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="e.g. YouTube AdSense January payout"
              className="w-full bg-zinc-950 border border-zinc-700 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-md text-sm font-medium text-zinc-400 bg-zinc-800 hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-md text-sm font-medium text-white bg-zinc-700 hover:bg-zinc-600 transition-colors"
            >
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
