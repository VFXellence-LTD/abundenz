import { ECOSYSTEMS, REVENUE_STREAMS, EXPENSE_STREAMS } from "@/data/ecosystems";
import type { EcosystemId, StreamId, TransactionType } from "@/types";

export interface FilterState {
  dateFrom: string;
  dateTo: string;
  ecosystemId: EcosystemId | "all";
  stream: StreamId | "all";
  type: TransactionType | "all";
}

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

const ALL_STREAMS = [...REVENUE_STREAMS, ...EXPENSE_STREAMS];

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const set = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => set("dateFrom", e.target.value)}
          className="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:border-zinc-500"
        />
        <span className="text-zinc-600 text-sm">to</span>
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => set("dateTo", e.target.value)}
          className="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:border-zinc-500"
        />
      </div>

      <select
        value={filters.ecosystemId}
        onChange={(e) => set("ecosystemId", e.target.value as EcosystemId | "all")}
        className="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:border-zinc-500"
      >
        <option value="all">All Ecosystems</option>
        {ECOSYSTEMS.map((eco) => (
          <option key={eco.id} value={eco.id}>
            {eco.name}
          </option>
        ))}
      </select>

      <select
        value={filters.stream}
        onChange={(e) => set("stream", e.target.value as StreamId | "all")}
        className="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:border-zinc-500"
      >
        <option value="all">All Streams</option>
        {ALL_STREAMS.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>

      <div className="flex rounded-lg bg-zinc-900 border border-zinc-700 p-0.5 gap-0.5">
        {(["all", "income", "expense"] as const).map((t) => (
          <button
            key={t}
            onClick={() => set("type", t)}
            className={
              filters.type === t
                ? "px-3 py-1 rounded text-xs font-medium bg-zinc-700 text-zinc-100"
                : "px-3 py-1 rounded text-xs font-medium text-zinc-500 hover:text-zinc-300"
            }
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
