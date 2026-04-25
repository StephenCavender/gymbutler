import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser || !authUser.userId) {
      return null;
    }

    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_userId", (q) => q.eq("userId", authUser.userId!))
      .first();

    if (!settings) {
      // Return defaults if no settings exist
      return {
        theme: "system",
        locale: "en",
        weightUnit: "kg",
        percentagesMin: 50,
        percentagesMax: 100,
        percentagesStep: 5,
      };
    }

    return settings;
  },
});

export const upsert = mutation({
  args: {
    theme: v.optional(v.string()),
    locale: v.optional(v.string()),
    weightUnit: v.optional(v.string()),
    percentagesMin: v.optional(v.number()),
    percentagesMax: v.optional(v.number()),
    percentagesStep: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("userSettings")
      .withIndex("by_userId", (q) => q.eq("userId", authUser.userId!))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
      });
      return existing._id;
    } else {
      const id = await ctx.db.insert("userSettings", {
        userId: authUser.userId!,
        theme: args.theme ?? "system",
        locale: args.locale ?? "en",
        weightUnit: args.weightUnit ?? "kg",
        percentagesMin: args.percentagesMin ?? 50,
        percentagesMax: args.percentagesMax ?? 100,
        percentagesStep: args.percentagesStep ?? 5,
      });
      return id;
    }
  },
});