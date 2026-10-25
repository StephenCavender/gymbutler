import { describe, expect, it } from "vitest";

import { api } from "./_generated/api";
import { setup, signIn } from "./test.setup";

describe("privateData.get", () => {
  it("tells signed-out callers they are not authenticated", async () => {
    const t = setup();
    expect(await t.query(api.privateData.get, {})).toEqual({ message: "Not authenticated" });
  });

  it("returns the private message to signed-in users", async () => {
    const t = setup();
    const { client } = await signIn(t);
    expect(await client.query(api.privateData.get, {})).toEqual({ message: "This is private" });
  });
});
