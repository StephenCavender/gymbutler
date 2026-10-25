import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { getUserId, requireUserId } from "./auth";
import { settingsError, withDefaults, type Settings } from "./model/settings";
import { weightUnit } from "./schema";

/** The caller's saved settings (only fields they changed), or null. */
export const get = query({
  args: {},
  handler: async (ctx): Promise<Partial<Settings> | null> => {
    const userId = await getUserId(ctx);
    if (!userId) return null;

    const doc = await ctx.db
      .query("userSettings")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (!doc) return null;

    const { weightUnit, percentagesMin, percentagesMax, percentagesStep } = doc;
    return { weightUnit, percentagesMin, percentagesMax, percentagesStep };
  },
});

/** Save the given fields, rejecting changes that leave the settings invalid. */
export const upsert = mutation({
  args: {
    weightUnit: v.optional(weightUnit),
    percentagesMin: v.optional(v.number()),
    percentagesMax: v.optional(v.number()),
    percentagesStep: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    const existing = await ctx.db
      .query("userSettings")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    const error = settingsError(withDefaults({ ...existing, ...args }));
    if (error) throw new ConvexError(error);

    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }
    return await ctx.db.insert("userSettings", { userId, ...args });
  },
});
