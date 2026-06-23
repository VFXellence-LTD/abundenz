import type { ClipDraft } from "./types.js";

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

/** Identity tokens that must never appear (brand isolation: Viral is anonymous). */
const OWNER_IDENTITY_PATTERNS: RegExp[] = [
  /robin\s+dutta/i,
  /\bvfxellence\b/i,
  /\bhalon\b/i,
  /\bpolymath\b/i,
  /rdutta/i,
];

/** Keys that indicate a rendered/produced asset — out of scope for the script-level MVP. */
const FORBIDDEN_RENDER_KEYS = ["videoPath", "voiceoverPath", "audioPath", "renderedAt", "assets", "mp4", "elevenlabs"];

const ALLOWED_KEYS = new Set<keyof ClipDraft>([
  "brand", "hook", "script", "shotlist", "caption", "hashtags", "sourceRefs", "safeguardReport",
]);

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

export function validateDraft(draft: ClipDraft): ValidationResult {
  const errors: string[] = [];

  // Scope guard: no render/asset keys (script-level only).
  for (const key of Object.keys(draft as unknown as Record<string, unknown>)) {
    if (!ALLOWED_KEYS.has(key as keyof ClipDraft)) {
      errors.push(`Unexpected field "${key}" — script-level draft only, no render/asset data.`);
    }
  }
  for (const k of FORBIDDEN_RENDER_KEYS) {
    if (k in (draft as unknown as Record<string, unknown>)) {
      errors.push(`Forbidden render field "${k}" — script-level draft only.`);
    }
  }

  if (!draft.brand || !draft.brand.trim()) errors.push("Missing brand (anonymous sub-brand required).");
  if (!draft.hook || !draft.hook.trim()) errors.push("Missing hook.");
  if (!draft.script || !draft.script.trim()) errors.push("Missing script.");

  const wc = wordCount(draft.script);
  if (draft.script.trim() && (wc < 50 || wc > 180)) {
    errors.push(`Script ~30-45s should be 50-180 words; got ${wc}.`);
  }

  if (!Array.isArray(draft.shotlist) || draft.shotlist.length < 1) {
    errors.push("Shotlist must have at least one entry.");
  }

  if (!Array.isArray(draft.hashtags) || draft.hashtags.length < 3 || draft.hashtags.length > 5) {
    errors.push("Hashtags must number 3-5 (Zrodinger niche + trending).");
  }

  if (!Array.isArray(draft.sourceRefs) || draft.sourceRefs.length < 1) {
    errors.push("At least one sourceRef required (factual traceability).");
  }

  // Brand isolation: no owner identity anywhere in human-visible text.
  const haystack = [draft.brand, draft.hook, draft.script, draft.caption, ...draft.hashtags].join("\n");
  for (const re of OWNER_IDENTITY_PATTERNS) {
    if (re.test(haystack)) {
      errors.push(`Brand isolation violation: owner/operator identity present (matched ${re}).`);
    }
  }

  return { ok: errors.length === 0, errors };
}
