import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User settings/preferences
  userSettings: defineTable({
    userId: v.string(),
    theme: v.optional(v.string()), // "light", "dark", "system"
    locale: v.optional(v.string()), // "en", "es"
    weightUnit: v.optional(v.string()), // "kg" | "lbs"
    percentagesMin: v.optional(v.number()), // default 50
    percentagesMax: v.optional(v.number()), // default 100
    percentagesStep: v.optional(v.number()), // default 5
  })
    .index("by_userId", ["userId"]),

  // Weight entry for percentages calculator
  percentagesEntry: defineTable({
    userId: v.string(),
    weight: v.number(),
    unit: v.string(), // "kg" | "lbs"
    results: v.array(
      v.object({
        percentage: v.number(),
        weight: v.number(),
      })
    ),
    createdAt: v.number(), // timestamp
  })
    .index("by_userId", ["userId"])
    .index("by_userId_createdAt", ["userId", "createdAt"]),

  // Weight conversion history
  conversionEntry: defineTable({
    userId: v.string(),
    fromWeight: v.number(),
    fromUnit: v.string(), // "kg" | "lbs"
    toWeight: v.number(),
    toUnit: v.string(), // "kg" | "lbs"
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_createdAt", ["userId", "createdAt"]),

  // Timer sessions
  timerSession: defineTable({
    userId: v.string(),
    totalSeconds: v.number(),
    rounds: v.array(
      v.object({
        roundNumber: v.number(),
        durationSeconds: v.number(),
        timestamp: v.number(),
      })
    ),
    status: v.string(), // "completed" | "cancelled"
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_createdAt", ["userId", "createdAt"]),

  // Stopwatch sessions
  stopwatchSession: defineTable({
    userId: v.string(),
    laps: v.array(
      v.object({
        lapNumber: v.number(),
        lapTimeSeconds: v.number(),
        totalTimeSeconds: v.number(),
        timestamp: v.number(),
      })
    ),
    totalTimeSeconds: v.number(),
    status: v.string(), // "completed" | "cancelled"
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_createdAt", ["userId", "createdAt"]),
});