import { describe, it, expect } from "vitest";
import { resolveBrandCreds } from "../credentials.js";

describe("resolveBrandCreds — brand isolation", () => {
  it("returns provider null (dry-run) when no suffixed env key present", () => {
    expect(resolveBrandCreds("viral", {})).toEqual({ provider: null });
  });

  it("resolves Buffer creds only for the matching ecosystem suffix", () => {
    const env = { BUFFER_TOKEN__VIRAL: "tok-viral" };
    expect(resolveBrandCreds("viral", env)).toEqual({ provider: "buffer", bufferToken: "tok-viral" });
    // affiliate has no key -> dry-run, never inherits viral's token
    expect(resolveBrandCreds("affiliate", env)).toEqual({ provider: null });
  });

  it("ignores a bare BUFFER_TOKEN (no suffix) to prevent cross-brand bleed", () => {
    expect(resolveBrandCreds("viral", { BUFFER_TOKEN: "global-leak" })).toEqual({ provider: null });
  });

  it("resolves Postiz with api key + url", () => {
    const env = { POSTIZ_API_KEY__CONTENT: "k", POSTIZ_API_URL__CONTENT: "https://postiz.local" };
    expect(resolveBrandCreds("content", env)).toEqual({
      provider: "postiz", postizApiKey: "k", postizApiUrl: "https://postiz.local",
    });
  });
});
