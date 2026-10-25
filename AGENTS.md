# AGENTS.md

## Feedback loop

`bun run verify` (lint fix + format, typecheck, tests) must be green before you finish a task. The pre-commit hook runs the same checks and blocks failing commits; fix the cause rather than bypassing it.

## Conventions

- Pure logic (calculations, formatting) lives in `apps/web/src/lib/` with a colocated `*.test.ts`. Route components in `apps/web/src/routes/` stay thin and import from there; extract logic before adding to it.
- `apps/web/src/routeTree.gen.ts` and `packages/backend/convex/_generated/` are generated; edit their sources (routes, Convex functions) and let the tooling regenerate them.

## Gotchas

- The web app uses Convex only for auth today. Tool pages keep state locally (settings in `localStorage`); the Convex history tables and functions exist but no page calls them yet.
- This is a port of the React Native app in `~/Projects/gymbutler-mobile`. Where behaviour diverges, the web app's tests are the source of truth.
