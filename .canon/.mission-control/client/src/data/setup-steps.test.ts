import { describe, it, expect } from "vitest";
import { SETUP_STEPS } from "./setup-steps";

const byId = (id: string) => SETUP_STEPS.find((s) => s.id === id)!;

describe("SETUP_STEPS channel annotations", () => {
  it("channel steps carry a channelSpec; freetext steps do not", () => {
    expect(byId("youtube").kind).toBe("channel");
    expect(byId("beehiiv").kind).toBe("channel");
    expect(byId("ghost").kind).toBe("channel");
    expect(byId("socials").kind).toBe("channel");
    expect(byId("domain").kind).toBe("freetext");
    expect(byId("first_episode").kind).toBe("freetext");
    expect(byId("agent_01").kind).toBe("freetext");
  });

  it("email is a freetext step that writes to Brand.email", () => {
    expect(byId("email").kind).toBe("freetext");
    expect(byId("email").writesToBrand).toBe("email");
  });

  it("youtube maps channelUrl->url and channelName->handle on the youtube platform", () => {
    const spec = byId("youtube").channelSpec!;
    expect(spec).toHaveLength(1);
    expect(spec[0].platform).toBe("youtube");
    expect(spec[0].fields).toEqual([
      { fieldKey: "channelUrl", accountField: "url" },
      { fieldKey: "channelName", accountField: "handle" },
    ]);
  });

  it("socials expands to four platform accounts, each field->handle", () => {
    const spec = byId("socials").channelSpec!;
    expect(spec.map((s) => s.platform)).toEqual(["x", "linkedin", "tiktok", "instagram"]);
    for (const s of spec) {
      expect(s.fields).toHaveLength(1);
      expect(s.fields[0].accountField).toBe("handle");
    }
  });
});
