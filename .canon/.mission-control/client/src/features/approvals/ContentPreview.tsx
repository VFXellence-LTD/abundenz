import type { ApprovalContent } from "@/lib/engine";

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{label}</h4>
      <div className="text-sm text-zinc-300">{children}</div>
    </div>
  );
}

function asList(v: string[] | string | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : v.split("\n").map((s) => s.trim()).filter(Boolean);
}

export function ContentPreview({ content }: { content?: ApprovalContent }) {
  if (!content) return <p className="text-sm italic text-zinc-600">No content payload.</p>;
  const shots = asList(content.shotlist);
  const tags = asList(content.hashtags);
  const safeguard =
    typeof content.safeguardReport === "string"
      ? content.safeguardReport
      : content.safeguardReport
        ? JSON.stringify(content.safeguardReport, null, 2)
        : undefined;

  return (
    <div className="space-y-3">
      {content.hook && <Section label="Hook"><p className="font-medium">{content.hook}</p></Section>}
      {content.script && (
        <Section label="Script">
          <pre className="whitespace-pre-wrap rounded bg-zinc-950 p-2 text-xs leading-relaxed text-zinc-300">{content.script}</pre>
        </Section>
      )}
      {shots.length > 0 && (
        <Section label="Shotlist">
          <ol className="list-decimal space-y-0.5 pl-5">{shots.map((s, i) => <li key={i}>{s}</li>)}</ol>
        </Section>
      )}
      {content.caption && <Section label="Caption"><p>{content.caption}</p></Section>}
      {tags.length > 0 && (
        <Section label="Hashtags">
          <div className="flex flex-wrap gap-1">{tags.map((t, i) => <span key={i} className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-emerald-300">{t.startsWith("#") ? t : `#${t}`}</span>)}</div>
        </Section>
      )}
      {safeguard && (
        <Section label="Safeguard Report">
          <pre className="whitespace-pre-wrap rounded border border-yellow-700/40 bg-yellow-950/20 p-2 text-xs text-yellow-100">{safeguard}</pre>
        </Section>
      )}
    </div>
  );
}
