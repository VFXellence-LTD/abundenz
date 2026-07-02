import { useState } from "react";
import type { PlatformAccount } from "@/types";

interface AddChannelProps {
  accounts: PlatformAccount[];
  onAdd: (platform: string, handle: string) => void;
  onRemove: (id: number) => void;
}

const inputCls = "rounded border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500";

export function AddChannel({ accounts, onAdd, onRemove }: AddChannelProps) {
  const [platform, setPlatform] = useState("");
  const [handle, setHandle] = useState("");

  const add = () => {
    const p = platform.trim();
    if (!p) return;
    onAdd(p, handle.trim());
    setPlatform("");
    setHandle("");
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-4">
      <div className="space-y-2">
        {accounts.length === 0 && <p className="text-sm text-zinc-500">No channels yet.</p>}
        {accounts.map((a) => (
          <div key={a.id ?? a.platform} className="flex items-center justify-between rounded border border-zinc-800 bg-zinc-950 px-3 py-2">
            <span className="text-sm text-zinc-300">
              <span className="font-medium">{a.platform}</span>
              {a.handle && <span className="text-zinc-500"> · {a.handle}</span>}
            </span>
            {a.id !== undefined && (
              <button type="button" onClick={() => onRemove(a.id!)} className="text-xs text-zinc-500 hover:text-red-400">Remove</button>
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="add-platform" className="text-xs text-zinc-500">Platform</label>
          <input id="add-platform" aria-label="Platform" className={inputCls} value={platform} onChange={(e) => setPlatform(e.target.value)} placeholder="tiktok" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="add-handle" className="text-xs text-zinc-500">Handle</label>
          <input id="add-handle" aria-label="Handle" className={inputCls} value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@yourbrand" />
        </div>
        <button type="button" onClick={add} className="border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 rounded hover:bg-zinc-700">
          Add channel
        </button>
      </div>
    </div>
  );
}
