import type { ClipDraft, SafeguardFlag, SafeguardReport } from "./types.js";

/** Anti-pattern hook openers from the hook-library (quality floor failure). */
const WEAK_HOOK_PATTERNS: RegExp[] = [
  /^\s*hey\s+guys/i,
  /^\s*so\s+today/i,
  /^\s*in\s+this\s+(video|short)/i,
  /^\s*welcome\s+back/i,
  /^\s*what'?s\s+up/i,
];

/** Hard-ban 2 — hate / demeaning protected groups (punching down). */
const HATE_PATTERNS: RegExp[] = [
  /\b(inferior|subhuman|vermin)\b.*\b(race|ethnic|religion|gender|people|group)\b/i,
  /\b(race|ethnic|religion|gender|people|group)\b.*\b(inferior|subhuman|vermin)\b/i,
  /\bgo back to your country\b/i,
];

/** Hard-ban 3 — fabricated health/financial/news misinformation. */
const MISINFO_PATTERNS: RegExp[] = [
  /\bcures?\s+cancer\b/i,
  /\bmiracle\s+cure\b/i,
  /\b100%\s+(safe|effective|guaranteed)\b/i,
  // Fabricated financial return claims (e.g. "300% return, no risk")
  /\b\d{2,}%\s*(return|gains?|profit)\b/i,
  /\b(no risk|risk[- ]free)\b.*\b(return|profit)\b/i,
];

/** Hard-ban 7 — financial guarantees / advice presented as guidance. */
const FINANCIAL_GUARANTEE_PATTERNS: RegExp[] = [
  /\bguarantee[ds]?\b.*\b(return|profit|income|money)\b/i,
  /\b\d{2,}%\s*(return|gains?|profit)\b/i,
  /\b(no risk|risk[- ]free)\b.*\b(invest|return|profit)\b/i,
  /\byou should (put|invest|buy).*\b(savings|money|coin|stock|crypto)\b/i,
  /\bget rich (quick|fast)\b/i,
];

/** Affiliate/CTA signals that trigger the FTC disclosure requirement. */
const AFFILIATE_CTA_PATTERNS: RegExp[] = [
  /\blink in bio\b/i,
  /\bsign\s+up\b/i,
  /\buse my (code|link)\b/i,
  /\baffiliate\b/i,
  /\bdiscount code\b/i,
];

const FTC_DISCLOSURE_PATTERNS: RegExp[] = [/#ad\b/i, /\bsponsored\b/i, /\bpaid (link|partnership)\b/i, /\bincludes paid links\b/i, /\baffiliate link\b/i];
const AI_DISCLOSURE_PATTERNS: RegExp[] = [/\bai[- ]generated\b/i, /\bai[- ]assisted\b/i, /\bmade with ai\b/i, /#aigenerated\b/i];

const FINANCIAL_DISCLAIMER_PATTERNS: RegExp[] = [/\bresults (not|may not be) typical\b/i, /\bnot financial advice\b/i, /\bdo your own research\b/i];

function anyMatch(text: string, patterns: RegExp[]): boolean {
  return patterns.some((re) => re.test(text));
}

export function runSafeguardCheck(draft: ClipDraft): SafeguardReport {
  const flags: SafeguardFlag[] = [];
  const corpus = [draft.hook, draft.script, draft.caption, ...draft.hashtags].join("\n");
  const hasAffiliateCta = anyMatch(corpus, AFFILIATE_CTA_PATTERNS);

  // --- Hard bans (block) ---
  if (anyMatch(corpus, HATE_PATTERNS)) {
    flags.push({ rule: "hard-ban-2-hate-speech", severity: "block", message: "Content demeans a protected group (punching down)." });
  }
  if (anyMatch(corpus, MISINFO_PATTERNS)) {
    flags.push({ rule: "hard-ban-3-misinformation", severity: "block", message: "Fabricated health/absolute-safety claim." });
  }
  if (anyMatch(corpus, FINANCIAL_GUARANTEE_PATTERNS) && !anyMatch(corpus, FINANCIAL_DISCLAIMER_PATTERNS)) {
    flags.push({ rule: "hard-ban-7-financial-advice", severity: "block", message: "Financial guarantee/advice without a 'results not typical' disclaimer." });
  }

  // --- Quality floor ---
  if (!draft.hook.trim() || anyMatch(draft.hook, WEAK_HOOK_PATTERNS)) {
    flags.push({ rule: "quality-floor-hook", severity: "block", message: "Hook is a known anti-pattern / fails the first-2-seconds promise." });
  }

  // --- FTC affiliate disclosure (flag) ---
  if (hasAffiliateCta && !anyMatch(corpus, FTC_DISCLOSURE_PATTERNS)) {
    flags.push({ rule: "ftc-affiliate-disclosure", severity: "flag", message: "Affiliate CTA present but no FTC disclosure (e.g. #ad / 'includes paid links')." });
  }

  // --- AI content disclosure (flag) ---
  if (!anyMatch(corpus, AI_DISCLOSURE_PATTERNS)) {
    flags.push({ rule: "ai-disclosure", severity: "flag", message: "No AI-generated/assisted disclosure; required by TikTok/YouTube/IG." });
  }

  // --- Unverified factual claims (flag) ---
  const hasUnverified = draft.sourceRefs.some((s) => s.confidence === "unverified");
  if (hasUnverified && !/\b(allegedly|reportedly|according to|the story goes)\b/i.test(corpus)) {
    flags.push({ rule: "factual-accuracy-unverified", severity: "flag", message: "Unverified source referenced without qualifying language." });
  }

  const pass = !flags.some((f) => f.severity === "block");
  return { pass, flags, checkedAt: new Date().toISOString() };
}
