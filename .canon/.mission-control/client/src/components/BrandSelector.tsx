import type { BrandRecord } from "@/hooks/useBrands";

interface BrandSelectorProps {
  brands: BrandRecord[];
  activeBrandId: string | null;
  onSelect: (brandId: string) => void;
  onNew: () => void;
}

export function BrandSelector({ brands, activeBrandId, onSelect, onNew }: BrandSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <select
        aria-label="Active brand"
        className="border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-200 rounded focus:border-zinc-500 outline-none"
        value={activeBrandId ?? ""}
        onChange={(e) => onSelect(e.target.value)}
      >
        {activeBrandId === null && <option value="" disabled>Select a brand…</option>}
        {brands.map((b) => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>
      <button
        type="button"
        onClick={onNew}
        className="border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-200 rounded hover:bg-zinc-800"
      >
        ＋ New brand
      </button>
    </div>
  );
}
