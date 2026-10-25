#!/usr/bin/env bash
# Run the full stack locally: Convex + the web app on http://localhost:3001.
#
#   scripts/dev-local.sh         run in the foreground (Ctrl-C stops both)
#   scripts/dev-local.sh start   run in the background; returns once the app responds
#   scripts/dev-local.sh stop    stop a background run
#
# Uses the Convex dev deployment configured in packages/backend/.env.local.
# Without one, it runs a local anonymous Convex backend (no account needed).
set -euo pipefail

cd "$(dirname "$0")/.."
ROOT=$PWD
APP_URL="http://localhost:3001"
STATE_DIR="${TMPDIR:-/tmp}/gymbutler-dev"
PID_FILE="$STATE_DIR/pid"
LOG_FILE="$STATE_DIR/dev.log"
BACKEND_ENV="$ROOT/packages/backend/.env.local"
WEB_ENV="$ROOT/apps/web/.env"

running() { [[ -f "$PID_FILE" ]] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; }

# Copy KEY from packages/backend/.env.local into apps/web/.env (upsert).
sync_web_env() {
  local key value tmp
  touch "$WEB_ENV"
  for key in VITE_CONVEX_URL VITE_CONVEX_SITE_URL; do
    value=$(grep -E "^${key}=" "$BACKEND_ENV" | tail -n1 | cut -d= -f2- | sed -E "s/^['\"]|['\"]$//g; s/ +#.*$//")
    tmp=$(mktemp)
    grep -vE "^${key}=" "$WEB_ENV" > "$tmp" || true
    printf '%s=%s\n' "$key" "$value" >> "$tmp"
    cat "$tmp" > "$WEB_ENV" && rm -f "$tmp"
  done
}

# Better Auth needs SITE_URL and BETTER_AUTH_SECRET on the deployment.
ensure_auth_env() {
  cd "$ROOT/packages/backend"
  [[ -n "$(bunx convex env get SITE_URL 2>/dev/null)" ]] ||
    bunx convex env set SITE_URL "$APP_URL" >/dev/null
  [[ -n "$(bunx convex env get BETTER_AUTH_SECRET 2>/dev/null)" ]] ||
    bunx convex env set BETTER_AUTH_SECRET "$(openssl rand -base64 32)" >/dev/null
  cd "$ROOT"
}

run() {
  if [[ ! -f "$BACKEND_ENV" ]] || grep -q '^CONVEX_DEPLOYMENT=anonymous:' "$BACKEND_ENV"; then
    export CONVEX_AGENT_MODE=anonymous
    echo "Using a local anonymous Convex backend."
  else
    echo "Using the Convex dev deployment from packages/backend/.env.local."
  fi

  # Kill the whole process group (Convex, its local backend, Vite) on exit.
  trap 'trap - EXIT INT TERM; kill 0 2>/dev/null' EXIT INT TERM

  # Push once so .env.local exists before the web app reads it.
  (cd packages/backend && bunx convex dev --once)
  sync_web_env
  ensure_auth_env

  (cd packages/backend && bunx convex dev) &
  (cd apps/web && bunx vite dev --port 3001 --strictPort) &
  wait -n
}

case "${1:-run}" in
  run) run ;;
  start)
    if running; then echo "Already running: $APP_URL (log: $LOG_FILE)"; exit 0; fi
    mkdir -p "$STATE_DIR"
    setsid "$0" run > "$LOG_FILE" 2>&1 < /dev/null &
    echo $! > "$PID_FILE"
    for _ in $(seq 1 120); do
      if curl -sf -o /dev/null "$APP_URL"; then echo "Ready: $APP_URL (log: $LOG_FILE)"; exit 0; fi
      if ! running; then echo "Failed to start; last log lines:" >&2; tail -n 30 "$LOG_FILE" >&2; exit 1; fi
      sleep 1
    done
    echo "Timed out waiting for $APP_URL; see $LOG_FILE" >&2
    exit 1
    ;;
  stop)
    if running; then kill -- "-$(cat "$PID_FILE")" 2>/dev/null || true; echo "Stopped."; else echo "Not running."; fi
    rm -f "$PID_FILE"
    ;;
  *) echo "usage: $0 [run|start|stop]" >&2; exit 2 ;;
esac
