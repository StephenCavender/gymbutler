import type { FunctionReference } from "convex/server";
import { describe, expect, it } from "vitest";

import { api } from "./_generated/api";
import { setup, signIn } from "./test.setup";

// percentages, conversions, timer and stopwatch share one shape:
// `log` stores an entry for the signed-in user, `getRecent` reads them back.
type HistoryModule = {
  name: string;
  table: "percentagesEntry" | "conversionEntry" | "timerSession" | "stopwatchSession";
  log: FunctionReference<"mutation">;
  getRecent: FunctionReference<"query">;
  entry: (n: number) => Record<string, unknown>;
};

const modules: HistoryModule[] = [
  {
    name: "percentages",
    table: "percentagesEntry",
    log: api.percentages.log,
    getRecent: api.percentages.getRecent,
    entry: (n) => ({
      weight: 100 + n,
      unit: "kg",
      results: [{ percentage: 50, weight: (100 + n) / 2 }],
    }),
  },
  {
    name: "conversions",
    table: "conversionEntry",
    log: api.conversions.log,
    getRecent: api.conversions.getRecent,
    entry: (n) => ({ fromWeight: 100 + n, fromUnit: "kg", toWeight: 220 + n, toUnit: "lbs" }),
  },
  {
    name: "timer",
    table: "timerSession",
    log: api.timer.log,
    getRecent: api.timer.getRecent,
    entry: (n) => ({
      totalSeconds: 60 + n,
      rounds: [{ roundNumber: 1, durationSeconds: 60 + n, timestamp: 0 }],
      status: "completed",
    }),
  },
  {
    name: "stopwatch",
    table: "stopwatchSession",
    log: api.stopwatch.log,
    getRecent: api.stopwatch.getRecent,
    entry: (n) => ({
      laps: [{ lapNumber: 1, lapTimeSeconds: 30 + n, totalTimeSeconds: 30 + n, timestamp: 0 }],
      totalTimeSeconds: 30 + n,
      status: "completed",
    }),
  },
];

describe.each(modules)("$name", ({ table, log, getRecent, entry }) => {
  it("stores an entry for the signed-in user and returns it", async () => {
    const t = setup();
    const { client, userId } = await signIn(t);

    const before = Date.now();
    const id = await client.mutation(log, entry(1));

    const [stored] = await client.query(getRecent, {});
    expect(stored).toMatchObject({ _id: id, userId, ...entry(1) });
    expect(stored.createdAt).toBeGreaterThanOrEqual(before);

    const row = await t.run((ctx) => ctx.db.query(table).first());
    expect(row?.userId).toBe(userId);
  });

  it("returns newest first, 10 by default, honouring limit", async () => {
    const t = setup();
    const { client } = await signIn(t);
    for (let n = 0; n < 12; n++) await client.mutation(log, entry(n));

    const recent = await client.query(getRecent, {});
    expect(recent).toHaveLength(10);
    expect(recent[0]).toMatchObject(entry(11));
    expect(recent[9]).toMatchObject(entry(2));

    expect(await client.query(getRecent, { limit: 3 })).toHaveLength(3);
  });

  it("only returns the caller's own entries", async () => {
    const t = setup();
    const alice = await signIn(t, "Alice");
    const bob = await signIn(t, "Bob");

    await alice.client.mutation(log, entry(1));
    await bob.client.mutation(log, entry(2));

    const aliceRecent = await alice.client.query(getRecent, {});
    expect(aliceRecent).toHaveLength(1);
    expect(aliceRecent[0]).toMatchObject({ userId: alice.userId, ...entry(1) });
  });

  it("rejects writes when signed out", async () => {
    const t = setup();
    await expect(t.mutation(log, entry(1))).rejects.toThrow();
    expect(await t.run((ctx) => ctx.db.query(table).collect())).toHaveLength(0);
  });

  it("rejects writes with an expired session", async () => {
    const t = setup();
    const { client } = await signIn(t, "Lifter", { expiresIn: -1000 });
    await expect(client.mutation(log, entry(1))).rejects.toThrow();
  });

  it("returns an empty list when signed out", async () => {
    const t = setup();
    expect(await t.query(getRecent, {})).toEqual([]);
  });
});
