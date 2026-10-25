import { api } from "@gymbutler/backend/convex/_generated/api";
import { Button } from "@gymbutler/ui/components/button";
import { Card } from "@gymbutler/ui/components/card";
import { createFileRoute } from "@tanstack/react-router";
import { useConvexAuth, useQuery } from "convex/react";
import { useState } from "react";

import { RecentSessions } from "@/components/recent-sessions";
import { useNow } from "@/hooks/use-now";
import { useSessionLogger } from "@/hooks/use-session-logger";
import {
  currentSplitMs,
  elapsedMs,
  isRunning,
  mark,
  newClock,
  pause,
  splits,
  start,
} from "@/lib/clock";
import { stopwatchSessionLog } from "@/lib/session-log";
import { durationStats, formatDuration, formatStopwatch } from "@/lib/time";

export const Route = createFileRoute("/stopwatch")({
  component: StopwatchPage,
});

function StopwatchPage() {
  const [clock, setClock] = useState(newClock);
  const running = isRunning(clock);
  const now = useNow(running ? 31 : null);
  const logSession = useSessionLogger(api.stopwatch.log);

  const { isAuthenticated } = useConvexAuth();
  const recent = useQuery(api.stopwatch.getRecent, isAuthenticated ? { limit: 5 } : "skip");

  const totalSeconds = elapsedMs(clock, now) / 1000;
  const lapSeconds = splits(clock).map((ms) => ms / 1000);
  const stats = durationStats(lapSeconds);

  const reset = () => {
    logSession(stopwatchSessionLog(clock, Date.now()));
    setClock(newClock());
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-6 text-3xl font-bold">Stopwatch</h1>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <div className="mb-2 text-sm text-muted-foreground">Total Time</div>
            <div
              role="timer"
              className="inline-block rounded-lg bg-muted px-8 py-4 text-5xl font-bold tabular-nums md:text-6xl"
            >
              {formatStopwatch(totalSeconds)}
            </div>

            <div className="mt-2 text-sm text-muted-foreground">
              Lap {lapSeconds.length + 1}: {formatStopwatch(currentSplitMs(clock, now) / 1000)}
            </div>
          </div>

          <div className="flex justify-center gap-3">
            {!running ? (
              <Button
                onClick={() => setClock((c) => start(c, Date.now()))}
                size="lg"
                className="min-w-[120px]"
              >
                {totalSeconds === 0 ? "Start" : "Resume"}
              </Button>
            ) : (
              <Button
                onClick={() => setClock((c) => pause(c, Date.now()))}
                size="lg"
                variant="outline"
                className="min-w-[120px]"
              >
                Stop
              </Button>
            )}

            <Button
              onClick={() => setClock((c) => mark(c, Date.now()))}
              variant="secondary"
              size="lg"
              disabled={!running}
            >
              Lap
            </Button>

            <Button onClick={reset} variant="destructive" size="lg" disabled={totalSeconds === 0}>
              Reset
            </Button>
          </div>

          {lapSeconds.length > 0 && (
            <div className="mt-6 space-y-2">
              <h3 className="font-medium">Laps</h3>
              <div className="max-h-[300px] space-y-1 overflow-y-auto">
                {lapSeconds
                  .map((s, i) => ({ s, n: i + 1 }))
                  .reverse()
                  .map(({ s, n }) => (
                    <div
                      key={n}
                      className="flex justify-between rounded bg-muted/50 px-3 py-2 text-sm"
                    >
                      <span>Lap {n}</span>
                      <span className="font-mono tabular-nums">{formatStopwatch(s)}</span>
                    </div>
                  ))}
              </div>

              {stats && (
                <div className="mt-2 rounded bg-muted/30 px-3 py-2 text-sm">
                  <div className="flex justify-between">
                    <span>Average</span>
                    <span className="font-mono tabular-nums">{formatStopwatch(stats.average)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Best</span>
                    <span className="font-mono tabular-nums text-green-600 dark:text-green-400">
                      {formatStopwatch(stats.best)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Worst</span>
                    <span className="font-mono tabular-nums text-red-600 dark:text-red-400">
                      {formatStopwatch(stats.worst)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      <RecentSessions
        sessions={recent?.map((s) => ({
          id: s._id,
          createdAt: s.createdAt,
          summary: formatDuration(Math.round(s.totalTimeSeconds)),
          detail:
            s.laps.length > 0 ? `${s.laps.length} lap${s.laps.length === 1 ? "" : "s"}` : undefined,
        }))}
      />
    </div>
  );
}
