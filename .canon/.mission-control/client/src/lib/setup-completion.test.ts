import { describe, it, expect } from "vitest";
import { isStepComplete } from "./setup-completion";
import type { SetupStep, PlatformAccount } from "@/types";

const acct = (platform: string, status: PlatformAccount["status"]): PlatformAccount => ({ platform, handle: "", email: "", status });

const youtubeStep = { id: "youtube", kind: "channel", channelSpec: [{ platform: "youtube", fields: [{ fieldKey: "channelUrl", accountField: "url" }] }] } as unknown as SetupStep;
const socialsStep = { id: "socials", kind: "channel", channelSpec: [
  { platform: "x", fields: [{ fieldKey: "x", accountField: "handle" }] },
  { platform: "linkedin", fields: [{ fieldKey: "linkedin", accountField: "handle" }] },
] } as unknown as SetupStep;
const emailStep = { id: "email", kind: "freetext", writesToBrand: "email" } as unknown as SetupStep;
const domainStep = { id: "domain", kind: "freetext" } as unknown as SetupStep;

describe("isStepComplete", () => {
  it("channel step complete when its account is active", () => {
    expect(isStepComplete(youtubeStep, { accounts: [acct("youtube", "active")], progress: {}, brandEmail: "" })).toBe(true);
    expect(isStepComplete(youtubeStep, { accounts: [acct("youtube", "not-started")], progress: {}, brandEmail: "" })).toBe(false);
    expect(isStepComplete(youtubeStep, { accounts: [], progress: {}, brandEmail: "" })).toBe(false);
  });

  it("socials complete only when ALL its accounts are active", () => {
    expect(isStepComplete(socialsStep, { accounts: [acct("x", "active"), acct("linkedin", "active")], progress: {}, brandEmail: "" })).toBe(true);
    expect(isStepComplete(socialsStep, { accounts: [acct("x", "active"), acct("linkedin", "not-started")], progress: {}, brandEmail: "" })).toBe(false);
  });

  it("email step complete when brand email is non-empty", () => {
    expect(isStepComplete(emailStep, { accounts: [], progress: {}, brandEmail: "hi@abundenz.com" })).toBe(true);
    expect(isStepComplete(emailStep, { accounts: [], progress: {}, brandEmail: "" })).toBe(false);
  });

  it("other freetext steps follow the explicit progress toggle", () => {
    expect(isStepComplete(domainStep, { accounts: [], progress: { domain: true }, brandEmail: "" })).toBe(true);
    expect(isStepComplete(domainStep, { accounts: [], progress: {}, brandEmail: "" })).toBe(false);
  });
});
