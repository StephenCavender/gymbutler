import { describe, expect, it } from "vitest";

import { api } from "./_generated/api";
import { setup, signIn } from "./test.setup";

const DEFAULTS = {
  theme: "system",
  locale: "en",
  weightUnit: "kg",
  percentagesMin: 50,
  percentagesMax: 100,
  percentagesStep: 5,
};

describe("settings.get", () => {
  it("returns null when signed out", async () => {
    const t = setup();
    expect(await t.query(api.settings.get, {})).toBeNull();
  });

  it("returns defaults when the user has saved nothing", async () => {
    const t = setup();
    const { client } = await signIn(t);
    expect(await client.query(api.settings.get, {})).toEqual(DEFAULTS);
  });
});

describe("settings.upsert", () => {
  it("creates settings, filling unspecified fields with defaults", async () => {
    const t = setup();
    const { client, userId } = await signIn(t);

    await client.mutation(api.settings.upsert, { weightUnit: "lbs", percentagesStep: 2.5 });

    expect(await client.query(api.settings.get, {})).toMatchObject({
      ...DEFAULTS,
      userId,
      weightUnit: "lbs",
      percentagesStep: 2.5,
    });
  });

  it("updates only the given fields on later calls", async () => {
    const t = setup();
    const { client } = await signIn(t);

    const id = await client.mutation(api.settings.upsert, { theme: "dark" });
    const again = await client.mutation(api.settings.upsert, { locale: "es" });

    expect(again).toBe(id);
    expect(await client.query(api.settings.get, {})).toMatchObject({
      ...DEFAULTS,
      theme: "dark",
      locale: "es",
    });
    expect(await t.run((ctx) => ctx.db.query("userSettings").collect())).toHaveLength(1);
  });

  it("keeps each user's settings separate", async () => {
    const t = setup();
    const alice = await signIn(t, "Alice");
    const bob = await signIn(t, "Bob");

    await alice.client.mutation(api.settings.upsert, { theme: "dark" });
    await bob.client.mutation(api.settings.upsert, { theme: "light" });

    expect(await alice.client.query(api.settings.get, {})).toMatchObject({ theme: "dark" });
    expect(await bob.client.query(api.settings.get, {})).toMatchObject({ theme: "light" });
  });

  it("rejects writes when signed out", async () => {
    const t = setup();
    await expect(t.mutation(api.settings.upsert, { theme: "dark" })).rejects.toThrow();
    expect(await t.run((ctx) => ctx.db.query("userSettings").collect())).toHaveLength(0);
  });
});
