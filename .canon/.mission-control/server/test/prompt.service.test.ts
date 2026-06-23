import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { buildViralPrompt } from "../services/prompt.service.js";

describe("buildViralPrompt", () => {
  let canon: string;
  beforeEach(() => {
    canon = fs.mkdtempSync(path.join(os.tmpdir(), "canon-doctrine-"));
    const formula = path.join(canon, "2_architect", "polymath-business", "ecosystems", "viral", "shared", "playbooks");
    const eco = path.join(canon, "2_architect", "polymath-business", "ecosystems", "viral");
    const safe = path.join(canon, "1_controller", "standards", "polymath-business", "safeguards");
    fs.mkdirSync(formula, { recursive: true });
    fs.mkdirSync(safe, { recursive: true });
    fs.writeFileSync(path.join(formula, "viral-formula.md"), "# Viral Formula\nHOOK then SCRIPT.", "utf-8");
    fs.writeFileSync(path.join(eco, "README.md"), "# Viral\nZrodinger clip spec here.", "utf-8");
    fs.writeFileSync(path.join(safe, "viral-safeguards.md"), "# Viral Safeguards\nNo medical claims.", "utf-8");
  });
  afterEach(() => { fs.rmSync(canon, { recursive: true, force: true }); });

  it("leads with /surge-generate <campaignId> and embeds the three doctrine sources", () => {
    const prompt = buildViralPrompt({ campaignId: "camp-9", canonPath: canon });
    expect(prompt.startsWith("/surge-generate camp-9")).toBe(true);
    expect(prompt).toContain("HOOK then SCRIPT");
    expect(prompt).toContain("Zrodinger clip spec");
    expect(prompt).toContain("No medical claims");
  });

  it("degrades gracefully when a doctrine file is missing (no throw)", () => {
    fs.rmSync(path.join(canon, "1_controller"), { recursive: true, force: true });
    const prompt = buildViralPrompt({ campaignId: "camp-9", canonPath: canon });
    expect(prompt).toContain("(not found)");
    expect(prompt).toContain("HOOK then SCRIPT");
  });
});
