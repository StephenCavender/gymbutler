import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

export const log = mutation({
  args: {
    weight: v.number(),
    unit: v.string(),
    results: v.array(
      v.object({
        percentage: v.number(),
        weight: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser || !authUser.userId) {
      throw new Error("Not authenticated");
    }

    const id = await ctx.db.insert("percentagesEntry", {
      userId: authUser.userId,
      weight: args.weight,
      unit: args.unit,
      results: args.results,
      createdAt: Date.now(),
    });

    return id;
  },
});

export const getRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    const userId = authUser?.userId;
    if (!userId) {
      return [];
    }

    const limit = args.limit ?? 10;
    const entries = await ctx.db
      .query("percentagesEntry")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);

    return entries;
  },
});
