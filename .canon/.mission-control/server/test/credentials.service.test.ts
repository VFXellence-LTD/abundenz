import { describe, it, expect, vi, afterEach } from "vitest";
import { resolveAccountCredential } from "../services/credentials.js";

afterEach(() => vi.restoreAllMocks());

describe("resolveAccountCredential", () => {
  it("returns the Buffer profileId when credential_ref env var is present", () => {
    const env = { BUFFER_PROFILE_ZRODINGER_TIKTOK: "profile_tiktok_123" };
    const result = resolveAccountCredential("BUFFER_PROFILE_ZRODINGER_TIKTOK", env);
    expect(result.profileId).toBe("profile_tiktok_123");
    expect(result.dryRun).toBe(false);
  });

  it("returns a synthetic profileId and dryRun=true when credential_ref env var is absent", () => {
    const result = resolveAccountCredential("BUFFER_PROFILE_ZRODINGER_TIKTOK", {});
    expect(result.profileId).toMatch(/^dry-run-/);
    expect(result.dryRun).toBe(true);
  });

  it("logs [DRY-RUN] message when credential is absent", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    resolveAccountCredential("BUFFER_PROFILE_MISSING", {});
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("[DRY-RUN] Would resolve credential for BUFFER_PROFILE_MISSING"),
    );
  });

  it("returns dryRun=false when credential_ref is null (no cred configured)", () => {
    // null credential_ref = account has no credential key at all; treat as dry-run
    const result = resolveAccountCredential(null, { BUFFER_TOKEN__VIRAL: "x" });
    expect(result.dryRun).toBe(true);
    expect(result.profileId).toMatch(/^dry-run-/);
  });
});
