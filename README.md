# gymbutler

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines React, TanStack Router, Convex, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **TanStack Router** - File-based routing with full type safety
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **Shared UI package** - shadcn/ui primitives live in `packages/ui`
- **Convex** - Reactive backend-as-a-service platform
- **Authentication** - Better-Auth
- **Oxlint** - Oxlint + Oxfmt (linting & formatting)
- **PWA** - Progressive Web App support
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
bun install
```

## Convex Setup

First-time setup (Convex project, auth env vars, and production deploys) is scripted:

```bash
scripts/setup-deploy.sh
```

It walks you through each step and writes `apps/web/.env` for local dev. Then run:

```bash
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.

## Deployment

`.github/workflows/ci.yml` runs lint, typecheck and tests on every push and PR. On `master`, once they pass, it runs `scripts/build-production.sh` through `vercel build`, which deploys Convex to production and then builds the web app against it, then publishes to Vercel at https://app.gymbutler.cavender.dev.

Deploys stay off until `scripts/setup-deploy.sh` has set the required secrets and the `DEPLOY_ENABLED` repo variable.

## UI Customization

React web apps in this stack share shadcn/ui primitives through `packages/ui`.

- Change design tokens and global styles in `packages/ui/src/styles/globals.css`
- Update shared primitives in `packages/ui/src/components/*`
- Adjust shadcn aliases or style config in `packages/ui/components.json` and `apps/web/components.json`

### Add more shared components

Run this from the project root to add more primitives to the shared UI package:

```bash
npx shadcn@latest add accordion dialog popover sheet table -c packages/ui
```

Import shared components like this:

```tsx
import { Button } from "@gymbutler/ui/components/button";
```

### Add app-specific blocks

If you want to add app-specific blocks instead of shared primitives, run the shadcn CLI from `apps/web`.

## Git Hooks and Formatting

- Format and lint fix: `bun run check`
- Everything CI checks (lint fix, typecheck, tests): `bun run verify`
- The pre-commit hook runs lint-staged, typecheck and tests.

## Project Structure

```
gymbutler/
├── apps/
│   ├── web/         # Frontend application (React + TanStack Router)
├── packages/
│   ├── ui/          # Shared shadcn/ui components and styles
│   ├── backend/     # Convex backend functions and schema
```

## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run dev:web`: Start only the web application
- `bun run dev:setup`: Setup and configure your Convex project
- `bun run check-types`: Check TypeScript types across all apps
- `bun run check`: Run Oxlint and Oxfmt (fixing)
- `bun run lint`: Run Oxlint and Oxfmt (check only, as in CI)
- `bun run test`: Run all tests
- `bun run verify`: Lint fix, typecheck and test
- `cd apps/web && bun run generate-pwa-assets`: Generate PWA assets
