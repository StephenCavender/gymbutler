# AGENTS.md

## Feedback loop

`bun run verify` (lint fix + format, typecheck, tests) must be green before you finish a task. The pre-commit hook runs the same checks and blocks failing commits; fix the cause rather than bypassing it.

## Conventions

- Pure logic (calculations, formatting) lives in `apps/web/src/lib/` with a colocated `*.test.ts`. Route components in `apps/web/src/routes/` stay thin and import from there; extract logic before adding to it.
- Convex functions identify the caller with `getUserId` / `requireUserId` from `convex/auth.ts` (the Better Auth user `_id`). Tests sit beside them as `convex/*.test.ts`, using `setup()` and `signIn()` from `convex/test.setup.ts`.
- `apps/web/src/routeTree.gen.ts` and `packages/backend/convex/_generated/` are generated; edit their sources (routes, Convex functions) and let the tooling regenerate them.

## Gotchas

- The web app uses Convex only for auth today. Tool pages keep state locally (settings in `localStorage`); the Convex history tables and functions exist but no page calls them yet.
- `authUser.userId` on the Better Auth user is a deprecated field that stays empty for new users; use the helpers above.
- `convex-test` is pinned to 0.0.54 because later versions need `convex` >= 1.43 and fail at runtime against our 1.36. Unpin it when upgrading `convex`.
- This is a port of the React Native app in `~/Projects/gymbutler-mobile`. Where behaviour diverges, the web app's tests are the source of truth.
