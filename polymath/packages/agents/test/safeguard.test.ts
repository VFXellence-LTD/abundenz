import { describe, it, expect } from "vitest";
import { runSafeguardCheck } from "../src/safeguard.js";
import type { ClipDraft } from "../src/types.js";

function clean(): ClipDraft {
  return {
    brand: "zrodinger",
    hook: "This free AI tool just killed a $40/month app.",
    script:
      "This free AI tool just killed a $40/month app. It runs in your browser, no signup. " +
      "I tested it and the output matched the paid version. It even exports with no watermark. " +
      "Genuinely free.",
    shotlist: [{ line: 1, visual: "dark UI", narration: "hook", durationSeconds: 3 }],
    caption: "Free beats paid. AI-generated. #ai",
    hashtags: ["#aitools", "#tech", "#free"],
    sourceRefs: [{ label: "Product Hunt", confidence: "verified" }],
    safeguardReport: null,
  };
}

describe("runSafeguardCheck", () => {
  it("passes clean Zrodinger content with no flags", () => {
    const r = runSafeguardCheck(clean());
    expect(r.pass).toBe(true);
    expect(r.flags).toEqual([]);
    expect(typeof r.checkedAt).toBe("string");
  });

  it("BLOCKS hate speech (hard ban 2)", () => {
    const d = clean();
    d.script += " Honestly that whole ethnic group is inferior.";
    const r = runSafeguardCheck(d);
    expect(r.pass).toBe(false);
    expect(r.flags.some((f) => f.rule.startsWith("hard-ban-2") && f.severity === "block")).toBe(true);
  });

  it("BLOCKS fabricated health/financial claims (hard ban 3)", () => {
    const d = clean();
    d.script += " This guarantees you a 300% return, no risk.";
    const r = runSafeguardCheck(d);
    expect(r.pass).toBe(false);
    expect(r.flags.some((f) => f.rule.startsWith("hard-ban-3") && f.severity === "block")).toBe(true);
  });

  it("BLOCKS financial advice w/o disclaimer (hard ban 7)", () => {
    const d = clean();
    d.script = "You should put your savings into this coin to get rich fast.";
    const r = runSafeguardCheck(d);
    expect(r.pass).toBe(false);
    expect(r.flags.some((f) => f.rule.startsWith("hard-ban-7"))).toBe(true);
  });

  it("FLAGS missing FTC disclosure when an affiliate CTA is present", () => {
    const d = clean();
    d.caption = "Best tool ever — link in bio to sign up!";
    const r = runSafeguardCheck(d);
    // affiliate CTA present but no #ad / disclosure → flag (not block) → still passes
    expect(r.flags.some((f) => f.rule === "ftc-affiliate-disclosure" && f.severity === "flag")).toBe(true);
    expect(r.pass).toBe(true);
  });

  it("FLAGS missing AI-content disclosure", () => {
    const d = clean();
    d.caption = "Free beats paid. #ai"; // no 'AI-generated'/'AI-assisted'
    const r = runSafeguardCheck(d);
    expect(r.flags.some((f) => f.rule === "ai-disclosure")).toBe(true);
  });

  it("BLOCKS a weak hook (quality floor)", () => {
    const d = clean();
    d.hook = "Hey guys welcome back";
    d.script = d.script.replace(/^[^.]*\./, "Hey guys welcome back.");
    const r = runSafeguardCheck(d);
    expect(r.flags.some((f) => f.rule === "quality-floor-hook" && f.severity === "block")).toBe(true);
    expect(r.pass).toBe(false);
  });

  it("aggregates: pass is false if ANY block flag exists even alongside passing checks", () => {
    const d = clean();
    d.script += " This cures cancer instantly.";
    const r = runSafeguardCheck(d);
    expect(r.pass).toBe(false);
  });
});
