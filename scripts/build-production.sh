#!/usr/bin/env bash
# Deploy Convex functions to production, then build the web app against that
# deployment. Run by `vercel build` (see vercel.json) in the deploy workflow.
# Requires CONVEX_DEPLOY_KEY (a production deploy key).
set -euo pipefail

: "${CONVEX_DEPLOY_KEY:?CONVEX_DEPLOY_KEY must be set to a Convex production deploy key}"

cd "$(dirname "$0")/../packages/backend"

# convex deploy sets VITE_CONVEX_URL and VITE_CONVEX_SITE_URL for --cmd, which
# runs in its own shell, hence the single quotes.
# shellcheck disable=SC2016
bunx convex deploy \
  --cmd-url-env-var-name VITE_CONVEX_URL \
  --cmd 'test -n "$VITE_CONVEX_SITE_URL" || { echo "VITE_CONVEX_SITE_URL not set by convex deploy" >&2; exit 1; }; cd ../../apps/web && bun run build'
