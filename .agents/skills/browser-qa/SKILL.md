---
name: browser-qa
description: Check the running GymButler web app in a headless browser (snapshots, screenshots, clicks, console). Use after changing anything under apps/web, when asked to QA or verify UI, or when a bug only shows in the browser.
---

# Browser QA

Tests, types, and lint prove the code holds together; this loop proves the page works. Look at what you changed the way a user would.

## 1. Start the app

Run `scripts/dev-local.sh start`. It starts Convex and Vite in the background and returns `Ready: http://localhost:3001` once the page responds; if already running it says so. On failure it prints the log tail: fix that before going on.

## 2. Drive the browser

The `chrome-devtools` MCP server (`.pi/mcp.json`) launches headless Chromium at a 390×844 phone viewport. Call its tools from `codemode` scripts as `tools.mcp__chrome_devtools__<tool>`. Every page tool takes `pageId`; the first page is `1` (`list_pages` shows the rest).

```js
const pageId = 1;
await tools.mcp__chrome_devtools__navigate_page({ pageId, url: "http://localhost:3001/timer" });
const snap = await tools.mcp__chrome_devtools__take_snapshot({ pageId });
text(snap.content[0].text);
const shot = await tools.mcp__chrome_devtools__take_screenshot({ pageId });
image(shot.content.find((c) => c.type === "image"));
const logs = await tools.mcp__chrome_devtools__list_console_messages({ pageId });
text(logs.content[0].text);
```

- `take_snapshot` returns the accessibility tree as text, with the `uid`s that `click`, `fill`, and `hover` take. It is cheap: default to it for structure and state.
- `take_screenshot` is for layout, spacing, colour, and overflow. Show it with `image()`.
- `list_console_messages` after each page: errors, React warnings, and `[issue]` lines are bugs.
- There are no timers in codemode; to wait, call `tools.bash({ command: "sleep 3" })` or `wait_for` with expected text.
- Other tools (`resize_page`, `emulate`, `press_key`, `evaluate_script`, …): `describeTool("mcp__chrome_devtools__<tool>")` for arguments.

If the `mcp__chrome_devtools` tools are missing, the project isn't trusted yet or pi needs `/reload`: tell the user rather than working around it.

After `navigate_page`, call `wait_for` with text you expect before anything else: a freshly started dev server can reload the page and leave the next call hanging. If a call times out after 60s, the server is stuck: run `pgrep -f '[c]hrome-devtools-mcp' | xargs -r kill` (the bracket keeps it from matching your own shell) and retry; pi reconnects on the next call.

## 3. Check what changed

Exercise the change itself, then the things this app makes easy to miss:

- **Phone first.** People use this mid-workout on a phone. At 390×844, look for horizontal overflow and cut-off controls; then check once at 1280×800 with `resize_page`.
- **Both themes.** Switch with the header's "Toggle theme" menu; the app uses a `dark` class, so emulating `prefers-color-scheme` alone does not switch it.
- **Time-based pages** (timer, stopwatch): start, wait a few seconds, and confirm the display moved; then pause, lap or round, and reset.
- **Auth.** Sign up with a throwaway `qa+<timestamp>@example.com`.

Done when every changed screen has been seen at phone width in both themes, its interactions exercised, and its console shows no new errors.

## 4. Stop and report

Run `scripts/dev-local.sh stop`. Report what you checked and what you found, with the screenshot paths for anything visual.
