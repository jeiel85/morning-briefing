import { describe, it, expect } from "vitest";
import { renderPushPayload } from "@/lib/push";

describe("renderPushPayload", () => {
  it("renders normal briefing payload", () => {
    const payload = renderPushPayload("Today's Briefing", 5);
    expect(payload.title).toBe("zam-dun");
    expect(payload.body).toContain("Today's Briefing");
    expect(payload.body).toContain("5 items");
    expect(payload.url).toBe("/app");
    expect(payload.urgent).toBeUndefined();
  });

  it("renders urgent briefing payload", () => {
    const payload = renderPushPayload("Breaking News", 3, true);
    expect(payload.title).toContain("Urgent");
    expect(payload.urgent).toBe(true);
  });
});
