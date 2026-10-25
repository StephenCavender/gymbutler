import { describe, expect, it } from "vitest";

import { api } from "./_generated/api";
import { setup, signIn } from "./test.setup";

describe("settings.get", () => {
  it("returns null when signed out", async () => {
    const t = setup();
    expect(await t.query(api.settings.get, {})).toBeNull();
  });

  it("returns null when the user has saved nothing", async () => {
    const t = setup();
    const { client } = await signIn(t);
    expect(await client.query(api.settings.get, {})).toBeNull();
  });

  it("returns only the saved fields", async () => {
    const t = setup();
    const { client } = await signIn(t);
    await client.mutation(api.settings.upsert, { weightUnit: "lbs" });
    expect(await client.query(api.settings.get, {})).toEqual({ weightUnit: "lbs" });
  });
});

describe("settings.upsert", () => {
  it("merges later changes into the saved settings", async () => {
    const t = setup();
    const { client } = await signIn(t);

    await client.mutation(api.settings.upsert, { weightUnit: "lbs" });
    await client.mutation(api.settings.upsert, { percentagesMin: 60, percentagesStep: 10 });

    expect(await client.query(api.settings.get, {})).toEqual({
      weightUnit: "lbs",
      percentagesMin: 60,
      percentagesStep: 10,
    });
    expect(await t.run((ctx) => ctx.db.query("userSettings").collect())).toHaveLength(1);
  });

  it("rejects a change that conflicts with the saved settings", async () => {
    const t = setup();
    const { client } = await signIn(t);
    await client.mutation(api.settings.upsert, { percentagesMax: 80 });

    await expect(client.mutation(api.settings.upsert, { percentagesMin: 90 })).rejects.toThrow(
      /Minimum %/,
    );
    expect(await client.query(api.settings.get, {})).toEqual({ percentagesMax: 80 });
  });

  it("rejects invalid values on first save", async () => {
    const t = setup();
    const { client } = await signIn(t);
    await expect(client.mutation(api.settings.upsert, { percentagesStep: 0 })).rejects.toThrow();
    expect(await t.run((ctx) => ctx.db.query("userSettings").collect())).toHaveLength(0);
  });

  it("keeps each user's settings separate", async () => {
    const t = setup();
    const alice = await signIn(t, "Alice");
    const bob = await signIn(t, "Bob");

    await alice.client.mutation(api.settings.upsert, { weightUnit: "lbs" });

    expect(await alice.client.query(api.settings.get, {})).toEqual({ weightUnit: "lbs" });
    expect(await bob.client.query(api.settings.get, {})).toBeNull();
  });

  it("rejects writes when signed out", async () => {
    const t = setup();
    await expect(t.mutation(api.settings.upsert, { weightUnit: "lbs" })).rejects.toThrow();
    expect(await t.run((ctx) => ctx.db.query("userSettings").collect())).toHaveLength(0);
  });
});
