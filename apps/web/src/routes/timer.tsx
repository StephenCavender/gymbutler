import { api } from "@gymbutler/backend/convex/_generated/api";
import { Button } from "@gymbutler/ui/components/button";
import { Card } from "@gymbutler/ui/components/card";
import { Input } from "@gymbutler/ui/components/input";
import { Label } from "@gymbutler/ui/components/label";
import { createFileRoute } from "@tanstack/react-router";
import { useConvexAuth, useQuery } from "convex/react";
import { useEffect, useState } from "react";

import { FieldGroup } from "@/components/field-group";
import { RecentSessions } from "@/components/recent-sessions";
import { useNow } from "@/hooks/use-now";
import { useSessionLogger } from "@/hooks/use-session-logger";
import {
  currentSplitMs,
  elapsedMs,
  finishCountdown,
  isRunning,
  mark,
  newClock,
  pause,
  remainingMs,
  splits,
  start,
} from "@/lib/clock";
import { timerSessionLog } from "@/lib/session-log";
import { durationStats, formatDuration, formatStopwatch } from "@/lib/time";

export const Route = createFileRoute("/timer")({
  component: TimerPage,
});

function TimerPage() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const targetMs = (hours * 3600 + minutes * 60 + seconds) * 1000;

  const [clock, setClock] = useState(newClock);
  const [logged, setLogged] = useState(false);
  const running = isRunning(clock);
  const now = useNow(running ? 31 : null);
  const logSession = useSessionLogger(api.timer.log);

  const { isAuthenticated } = useConvexAuth();
  const recent = useQuery(api.timer.getRecent, isAuthenticated ? { limit: 5 } : "skip");

  // Stop at zero and log the finished session.
  useEffect(() => {
    const finished = finishCountdown(clock, targetMs, now);
    if (finished === clock) return;
    setClock(finished);
    logSession(timerSessionLog(finished, targetMs, now));
    setLogged(true);
  }, [clock, targetMs, now, logSession]);

  const started = running || elapsedMs(clock, now) > 0;
  const remaining = remainingMs(clock, targetMs, now);
  const roundMs = splits(clock);
  const stats = durationStats(roundMs.map((ms) => ms / 1000));

  const reset = () => {
    if (!logged) logSession(timerSessionLog(clock, targetMs, Date.now()));
    setClock(newClock());
    setLogged(false);
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-6 text-3xl font-bold">Timer</h1>

      <Card className="p-6">
        <div className="space-y-6">
          {!started && (
            <FieldGroup label="Set Duration" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {(
                  [
                    { id: "timer-hours", label: "Hours", value: hours, set: setHours, max: 23 },
                    {
                      id: "timer-minutes",
                      label: "Minutes",
                      value: minutes,
                      set: setMinutes,
                      max: 59,
                    },
                    {
                      id: "timer-seconds",
                      label: "Seconds",
                      value: seconds,
                      set: setSeconds,
                      max: 59,
                    },
                  ] as const
                ).map(({ id, label, value, set, max }) => (
                  <div key={id} className="space-y-2">
                    <Input
                      id={id}
                      type="number"
                      inputMode="numeric"
                      value={value}
                      onChange={(e) => set(parseInt(e.target.value) || 0)}
                      min={0}
                      max={max}
                      className="text-center"
                    />
                    <Label htmlFor={id} className="justify-center text-sm text-muted-foreground">
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </FieldGroup>
          )}

          <div className="text-center">
            <div
              role="timer"
              className={`inline-block rounded-lg px-8 py-4 text-5xl font-bold tabular-nums md:text-6xl ${
                started && remaining === 0 ? "bg-destructive/20 text-destructive" : "bg-muted"
              }`}
            >
              {formatStopwatch(remaining / 1000)}
            </div>
            {running && (
              <p className="mt-2 text-sm text-muted-foreground">
                Round {roundMs.length + 1}: {formatStopwatch(currentSplitMs(clock, now) / 1000)}
              </p>
            )}
          </div>

          <div className="flex justify-center gap-3">
            {!running ? (
              <Button
                onClick={() => setClock((c) => start(c, Date.now()))}
                size="lg"
                className="min-w-[120px]"
                disabled={targetMs === 0 || (started && remaining === 0)}
              >
                {started ? "Resume" : "Start"}
              </Button>
            ) : (
              <Button
                onClick={() => setClock((c) => pause(c, Date.now()))}
                size="lg"
                variant="outline"
                className="min-w-[120px]"
              >
                Pause
              </Button>
            )}

            {running && (
              <Button
                onClick={() => setClock((c) => mark(c, Date.now()))}
                variant="secondary"
                size="lg"
              >
                Round
              </Button>
            )}

            <Button onClick={reset} variant="destructive" size="lg" disabled={!started}>
              Reset
            </Button>
          </div>

          {roundMs.length > 0 && (
            <div className="mt-6 space-y-2">
              <h3 className="font-medium">Rounds</h3>
              <div className="space-y-1">
                {roundMs.map((ms, i) => (
                  <div
                    key={i}
                    className="flex justify-between rounded bg-muted/50 px-3 py-2 text-sm"
                  >
                    <span>Round {i + 1}</span>
                    <span className="font-mono tabular-nums">{formatStopwatch(ms / 1000)}</span>
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
                    <span className="font-mono tabular-nums">{formatStopwatch(stats.best)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Worst</span>
                    <span className="font-mono tabular-nums">{formatStopwatch(stats.worst)}</span>
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
          summary: formatDuration(Math.round(s.totalSeconds)),
          detail: [
            s.rounds.length > 0 && `${s.rounds.length} round${s.rounds.length === 1 ? "" : "s"}`,
            s.status === "cancelled" && "stopped early",
          ]
            .filter(Boolean)
            .join(", "),
        }))}
      />
    </div>
  );
}
