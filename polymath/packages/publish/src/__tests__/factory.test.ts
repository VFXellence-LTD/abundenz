import { describe, it, expect } from "vitest";
import { selectDistributor } from "../factory.js";
import { DryRunDistributor } from "../DryRunDistributor.js";
import { BufferDistributor } from "../BufferDistributor.js";
import { PostizDistributor } from "../PostizDistributor.js";

describe("selectDistributor", () => {
  it("returns DryRunDistributor when no brand creds (default)", () => {
    expect(selectDistributor("viral", {})).toBeInstanceOf(DryRunDistributor);
  });
  it("returns BufferDistributor for matching brand token", () => {
    expect(selectDistributor("viral", { BUFFER_TOKEN__VIRAL: "t" })).toBeInstanceOf(BufferDistributor);
  });
  it("returns PostizDistributor when postiz creds present", () => {
    expect(selectDistributor("content", { POSTIZ_API_KEY__CONTENT: "k", POSTIZ_API_URL__CONTENT: "u" }))
      .toBeInstanceOf(PostizDistributor);
  });
  it("isolates brands — viral creds do not produce a live distributor for affiliate", () => {
    expect(selectDistributor("affiliate", { BUFFER_TOKEN__VIRAL: "t" })).toBeInstanceOf(DryRunDistributor);
  });
});
