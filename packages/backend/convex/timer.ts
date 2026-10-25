import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getUserId, requireUserId } from "./auth";

export const log = mutation({
  args: {
    totalSeconds: v.number(),
    rounds: v.array(
      v.object({
        roundNumber: v.number(),
        durationSeconds: v.number(),
        timestamp: v.number(),
      }),
    ),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    const id = await ctx.db.insert("timerSession", {
      userId,
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
    const userId = await getUserId(ctx);
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
