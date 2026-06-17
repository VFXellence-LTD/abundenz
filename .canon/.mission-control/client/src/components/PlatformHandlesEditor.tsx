import { useState, useEffect, useCallback } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PlatformHandleRow {
  platform: string;
  handle: string;
  status: string;
}

const STATUS_OPTIONS = [
  "Not started",
  "Available",
  "Active",
  "Taken — using variant",
];

export function serializePlatformHandles(rows: PlatformHandleRow[]): string {
  return JSON.stringify(rows);
}

export function parsePlatformHandles(
  value: string,
  defaultPlatforms?: string[]
): PlatformHandleRow[] {
  if (value) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed as PlatformHandleRow[];
    } catch {
      // fall through to seed
    }
  }
  if (defaultPlatforms && defaultPlatforms.length > 0) {
    return defaultPlatforms.map((platform) => ({
      platform,
      handle: "",
      status: "Not started",
    }));
  }
  return [];
}

interface PlatformHandlesEditorProps {
  value: string;
  onChange: (value: string) => void;
  defaultPlatforms?: string[];
}

export function PlatformHandlesEditor({
  value,
  onChange,
  defaultPlatforms,
}: PlatformHandlesEditorProps) {
  const [rows, setRows] = useState<PlatformHandleRow[]>(() =>
    parsePlatformHandles(value, defaultPlatforms)
  );

  // Sync external value changes (e.g. reset) only when value changes to non-empty
  useEffect(() => {
    if (value) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          setRows(parsed as PlatformHandleRow[]);
        }
      } catch {
        // ignore invalid JSON coming from outside
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const commit = useCallback(
    (nextRows: PlatformHandleRow[]) => {
      setRows(nextRows);
      onChange(serializePlatformHandles(nextRows));
    },
    [onChange]
  );

  const addRow = () => {
    commit([...rows, { platform: "", handle: "", status: "Not started" }]);
  };

  const removeRow = (index: number) => {
    commit(rows.filter((_, i) => i !== index));
  };

  const updateRow = (
    index: number,
    field: keyof PlatformHandleRow,
    val: string
  ) => {
    const next = rows.map((row, i) =>
      i === index ? { ...row, [field]: val } : row
    );
    commit(next);
  };

  return (
    <div className="space-y-2">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-zinc-500 uppercase tracking-wider">
            <th className="text-left pb-2 pr-2 font-medium w-1/3">Platform</th>
            <th className="text-left pb-2 pr-2 font-medium w-1/3">Handle</th>
            <th className="text-left pb-2 pr-2 font-medium">Status</th>
            <th className="pb-2 w-8" />
          </tr>
        </thead>
        <tbody className="space-y-1">
          {rows.map((row, i) => (
            <tr key={i} className="align-middle">
              <td className="pr-2 py-1">
                <input
                  type="text"
                  value={row.platform}
                  onChange={(e) => updateRow(i, "platform", e.target.value)}
                  placeholder="Platform"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-md px-2 py-1 text-zinc-200 focus:outline-none focus:border-zinc-500 text-sm"
                />
              </td>
              <td className="pr-2 py-1">
                <input
                  type="text"
                  value={row.handle}
                  onChange={(e) => updateRow(i, "handle", e.target.value)}
                  placeholder="@handle"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-md px-2 py-1 text-zinc-200 focus:outline-none focus:border-zinc-500 text-sm"
                />
              </td>
              <td className="pr-2 py-1">
                <select
                  value={row.status}
                  onChange={(e) => updateRow(i, "status", e.target.value)}
                  className={cn(
                    "w-full bg-zinc-950 border border-zinc-700 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-zinc-500",
                    row.status === "Active"
                      ? "text-emerald-400"
                      : row.status === "Available"
                        ? "text-blue-400"
                        : row.status === "Taken — using variant"
                          ? "text-yellow-400"
                          : "text-zinc-400"
                  )}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-1 text-right">
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  aria-label="Remove"
                  className="text-zinc-600 hover:text-red-400 transition-colors p-1 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        type="button"
        onClick={addRow}
        aria-label="Add platform"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-zinc-400 bg-zinc-800 hover:text-zinc-200 hover:bg-zinc-700 transition-colors border border-zinc-700"
      >
        <Plus className="w-3.5 h-3.5" />
        Add platform
      </button>
    </div>
  );
}
