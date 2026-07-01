import { useState } from "react";
import type { EcosystemId } from "@/types";
import type { BrandRecord, NewBrand } from "@/hooks/useBrands";

interface BrandCreateFormProps {
  ecosystemId: EcosystemId;
  onCreate: (data: NewBrand) => Promise<BrandRecord>;
  onSeedChannels: (brandId: string) => void;
  onCreated: (brandId: string) => void;
}

export function BrandCreateForm({ ecosystemId, onCreate, onSeedChannels, onCreated }: BrandCreateFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const trimmed = name.trim();
    if (!trimmed) { setError("Brand name is required."); return; }
    if (!/z/i.test(trimmed)) { setError("Brand name must contain the letter “z”."); return; }
    setError(null);
    setBusy(true);
    try {
      const created = await onCreate({ name: trimmed, ecosystemId, ...(email.trim() ? { email: email.trim() } : {}) });
      if (ecosystemId === "content") onSeedChannels(created.id);
      onCreated(created.id);
      setName("");
      setEmail("");
    } catch {
      setError("Could not create the brand. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="brand-name" className="text-xs text-zinc-400">Brand name</label>
        <input
          id="brand-name"
          className="border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-200 rounded focus:border-zinc-500 outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Zrodinger"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="brand-email" className="text-xs text-zinc-400">Brand email (optional)</label>
        <input
          id="brand-email"
          type="email"
          className="border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-200 rounded focus:border-zinc-500 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="hi@abundenz.com"
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <button
        type="button"
        onClick={submit}
        disabled={busy}
        className="border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 rounded hover:bg-zinc-700 disabled:opacity-50"
      >
        Create brand
      </button>
    </div>
  );
}
