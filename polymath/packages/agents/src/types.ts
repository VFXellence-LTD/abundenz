/** Cross-plan constants — keep identical to Plan 1/2/3. */
export const VIRAL_ECOSYSTEM_ID = "viral" as const;
export const CLIP_CONTENT_TYPE = "clip" as const;

/** One narrated beat of the script-level draft. No render data — script only. */
export interface ShotlistEntry {
  /** Ordinal, 1-based. */
  line: number;
  /** What appears on screen (text description only — NOT a render prompt). */
  visual: string;
  /** Narration line spoken over this shot. */
  narration: string;
  /** Approx seconds this shot holds. */
  durationSeconds: number;
}

/** A source the draft draws on — for factual traceability (surge-formula constraint). */
export interface SourceRef {
  label: string;
  url?: string;
  /** "verified" | "unverified" — unverified claims must be flagged in narration. */
  confidence: "verified" | "unverified";
}

/** A single safeguard finding. Severity drives pass/fail. */
export interface SafeguardFlag {
  /** Stable rule id, e.g. "hard-ban-3-misinformation", "quality-floor-hook", "ftc-affiliate". */
  rule: string;
  severity: "block" | "flag";
  message: string;
}

/** Output of runSafeguardCheck. pass=false when any block-severity flag exists. */
export interface SafeguardReport {
  pass: boolean;
  flags: SafeguardFlag[];
  checkedAt: string;
}

/** The script-level clip draft. NO video, NO voiceover, NO render assets. */
export interface ClipDraft {
  /** Anonymous sub-brand only — brand isolation. Never an operator identity. */
  brand: string;
  /** First 1-3 seconds. Must satisfy the hook quality floor. */
  hook: string;
  /** Full narration, ~30-45s of spoken script (target 70-160 words). */
  script: string;
  /** Ordered shot-by-shot plan (script level — visual = description, not a prompt to render). */
  shotlist: ShotlistEntry[];
  /** Platform caption. Must carry AI-disclosure + FTC affiliate disclosure when links present. */
  caption: string;
  /** 3-5 niche+trending tags (Zrodinger = tech/AI-tools). */
  hashtags: string[];
  /** Sources the script draws on. */
  sourceRefs: SourceRef[];
  /** Populated by runSafeguardCheck before persistence. */
  safeguardReport: SafeguardReport | null;
}

/** Exact body for POST /api/approvals (camelCase, matches ApprovalsService.create). */
export interface ApprovalPayload {
  ecosystemId: typeof VIRAL_ECOSYSTEM_ID;
  contentType: typeof CLIP_CONTENT_TYPE;
  taskId?: string;
  campaignId?: string;
  artifactPath: string;
  contentJson: {
    hook: string;
    script: string;
    shotlist: ShotlistEntry[];
    caption: string;
    hashtags: string[];
    sourceRefs: SourceRef[];
    safeguardReport: SafeguardReport;
  };
}

export function makeEmptyDraft(brand: string): ClipDraft {
  return {
    brand,
    hook: "",
    script: "",
    shotlist: [],
    caption: "",
    hashtags: [],
    sourceRefs: [],
    safeguardReport: null,
  };
}
