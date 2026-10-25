import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const weightUnit = v.union(v.literal("kg"), v.literal("lbs"));
export const sessionStatus = v.union(v.literal("completed"), v.literal("cancelled"));

export default defineSchema({
  // Only the fields a user has changed; read with withDefaults() from model/settings.
  userSettings: defineTable({
    userId: v.string(),
    weightUnit: v.optional(weightUnit),
    percentagesMin: v.optional(v.number()),
    percentagesMax: v.optional(v.number()),
    percentagesStep: v.optional(v.number()),
  }).index("by_userId", ["userId"]),

  timerSession: defineTable({
    userId: v.string(),
    totalSeconds: v.number(),
    rounds: v.array(
      v.object({
        roundNumber: v.number(),
        durationSeconds: v.number(),
        timestamp: v.number(),
      }),
    ),
    status: sessionStatus,
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_createdAt", ["userId", "createdAt"]),

  stopwatchSession: defineTable({
    userId: v.string(),
    laps: v.array(
      v.object({
        lapNumber: v.number(),
        lapTimeSeconds: v.number(),
        totalTimeSeconds: v.number(),
        timestamp: v.number(),
      }),
    ),
    totalTimeSeconds: v.number(),
    status: sessionStatus,
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_createdAt", ["userId", "createdAt"]),
});
