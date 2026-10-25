import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getUserId, requireUserId } from "./auth";

export const log = mutation({
  args: {
    fromWeight: v.number(),
    fromUnit: v.string(),
    toWeight: v.number(),
    toUnit: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    const id = await ctx.db.insert("conversionEntry", {
      userId,
      fromWeight: args.fromWeight,
      fromUnit: args.fromUnit,
      toWeight: args.toWeight,
      toUnit: args.toUnit,
      createdAt: Date.now(),
    });

    return id;
  },
});

export const getRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      return [];
    }

    const limit = args.limit ?? 10;
    const entries = await ctx.db
      .query("conversionEntry")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);

    return entries;
  },
});
