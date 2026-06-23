import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ClaudeSessionsService } from "../services/claude-sessions.service.js";

const CWD = "D:\\VFXellence-LTD\\polymath\\packages\\agents";

describe("ClaudeSessionsService.findSessionForCampaign", () => {
  let tmp: string; let projectsDir: string;
  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "claude-sessions-"));
    // Same encoding the service uses for CWD -> project dir name.
    const encoded = CWD.replace(/[:\\/_ ]/g, "-").replace(/^-/, "");
    projectsDir = path.join(tmp, "projects", encoded);
    fs.mkdirSync(projectsDir, { recursive: true });
  });
  afterEach(() => { fs.rmSync(tmp, { recursive: true, force: true }); });

  it("returns the UUID of the jsonl whose message references the campaignId", async () => {
    const uuid = "123e4567-e89b-42d3-a456-426614174000";
    const line = JSON.stringify({ message: { role: "user", content: 'claude "/viral-generate camp-007"' } });
    fs.writeFileSync(path.join(projectsDir, `${uuid}.jsonl`), `${line}\n`, "utf-8");
    const svc = new ClaudeSessionsService(path.join(tmp, "projects"));
    expect(await svc.findSessionForCampaign("camp-007", CWD)).toBe(uuid);
  });

  it("returns null when no transcript references the campaignId", async () => {
    const line = JSON.stringify({ message: { content: "/viral-generate camp-OTHER" } });
    fs.writeFileSync(path.join(projectsDir, "deadbeef.jsonl"), `${line}\n`, "utf-8");
    const svc = new ClaudeSessionsService(path.join(tmp, "projects"));
    expect(await svc.findSessionForCampaign("camp-007", CWD)).toBeNull();
  });

  it("returns null when the project dir does not exist", async () => {
    const svc = new ClaudeSessionsService(path.join(tmp, "nope"));
    expect(await svc.findSessionForCampaign("camp-007", CWD)).toBeNull();
  });
});
