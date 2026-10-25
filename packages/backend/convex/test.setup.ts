/// <reference types="vite/client" />
import betterAuthTest from "@convex-dev/better-auth/test";
import { convexTest } from "convex-test";

import { components } from "./_generated/api";
import schema from "./schema";

// Multi-dot files (*.test.ts, test.setup.ts) are skipped by Convex deploys; exclude them here too.
export const modules = import.meta.glob(["./**/*.{ts,js}", "!./**/*.*.{ts,js}"]);

export function setup() {
  const t = convexTest(schema, modules);
  betterAuthTest.register(t);
  return t;
}

type Test = ReturnType<typeof setup>;

const HOUR = 60 * 60 * 1000;

/**
 * Seed a Better Auth user + session in the component and return a client
 * acting as that user. `expiresIn` < 0 gives an expired session.
 */
export async function signIn(t: Test, name = "Lifter", { expiresIn = HOUR } = {}) {
  const now = Date.now();
  const { user, session } = await t.run(async (ctx) => {
    const user = await ctx.runMutation(components.betterAuth.adapter.create, {
      input: {
        model: "user",
        data: {
          name,
          email: `${name.toLowerCase()}@example.com`,
          emailVerified: true,
          createdAt: now,
          updatedAt: now,
        },
      },
    });
    const session = await ctx.runMutation(components.betterAuth.adapter.create, {
      input: {
        model: "session",
        data: {
          userId: user._id,
          token: `token-${name}`,
          expiresAt: now + expiresIn,
          createdAt: now,
          updatedAt: now,
        },
      },
    });
    return { user, session };
  });

  return {
    userId: user._id as string,
    client: t.withIdentity({ subject: user._id, sessionId: session._id }),
  };
}
