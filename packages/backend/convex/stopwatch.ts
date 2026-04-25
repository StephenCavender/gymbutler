import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

export const log = mutation({
  args: {
    laps: v.array(
      v.object({
        lapNumber: v.number(),
        lapTimeSeconds: v.number(),
        totalTimeSeconds: v.number(),
        timestamp: v.number(),
      })
    ),
    totalTimeSeconds: v.number(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser || !authUser.userId) {
      throw new Error("Not authenticated");
    }

    const id = await ctx.db.insert("stopwatchSession", {
      userId: authUser.userId,
      laps: args.laps,
      totalTimeSeconds: args.totalTimeSeconds,
      status: args.status,
      createdAt: Date.now(),
    });

    return id;
  },
});

export const getRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser || !authUser.userId) {
      return [];
    }

    const limit = args.limit ?? 10;
    const sessions = await ctx.db
      .query("stopwatchSession")
      .withIndex("by_userId", (q) => q.eq("userId", authUser.userId))
      .order("desc")
      .take(limit);

    return sessions;
  },
});