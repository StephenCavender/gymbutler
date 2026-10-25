import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

export const log = mutation({
  args: {
    totalSeconds: v.number(),
    rounds: v.array(
      v.object({
        roundNumber: v.number(),
        durationSeconds: v.number(),
        timestamp: v.number(),
      })
    ),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser || !authUser.userId) {
      throw new Error("Not authenticated");
    }

    const id = await ctx.db.insert("timerSession", {
      userId: authUser.userId,
      totalSeconds: args.totalSeconds,
      rounds: args.rounds,
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
    const userId = authUser?.userId;
    if (!userId) {
      return [];
    }

    const limit = args.limit ?? 10;
    const sessions = await ctx.db
      .query("timerSession")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);

    return sessions;
  },
});