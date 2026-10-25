import { Button } from "@gymbutler/ui/components/button";
import { Card } from "@gymbutler/ui/components/card";
import { Input } from "@gymbutler/ui/components/input";
import { Label } from "@gymbutler/ui/components/label";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";

import { durationStats, formatDuration } from "@/lib/time";

export const Route = createFileRoute("/timer")({
  component: TimerPage,
});

interface Round {
  roundNumber: number;
  durationSeconds: number;
  timestamp: number;
}

function TimerPage() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [totalTargetSeconds, setTotalTargetSeconds] = useState(300);

  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentRoundStart, setCurrentRoundStart] = useState<number | null>(null);
  const [sessionStart, setSessionStart] = useState<number | null>(null);

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const target = hours * 3600 + minutes * 60 + seconds;
    if (target > 0) {
      setTotalTargetSeconds(target);
    }
  }, [hours, minutes, seconds]);

  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(totalTargetSeconds);
    }
  }, [totalTargetSeconds, isRunning]);

  const startTimer = useCallback(() => {
    setIsRunning(true);
    if (sessionStart === null) {
      setSessionStart(Date.now());
    }
    if (currentRoundStart === null) {
      setCurrentRoundStart(Date.now());
    }
  }, [sessionStart, currentRoundStart]);

  const recordRound = useCallback(() => {
    if (currentRoundStart !== null) {
      const duration = Math.floor((Date.now() - currentRoundStart) / 1000);
      setRounds((prev) => [
        ...prev,
        {
          roundNumber: prev.length + 1,
          durationSeconds: duration,
          timestamp: Date.now(),
        },
      ]);
      setCurrentRoundStart(Date.now());
    }
  }, [currentRoundStart]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(totalTargetSeconds);
    setRounds([]);
    setCurrentRoundStart(null);
    setSessionStart(null);
  }, [totalTargetSeconds]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const currentRoundDuration = currentRoundStart
    ? Math.floor((Date.now() - currentRoundStart) / 1000)
    : 0;

  const stats = durationStats(rounds.map((r) => r.durationSeconds));

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-6 text-3xl font-bold">Timer</h1>

      <Card className="p-6">
        <div className="space-y-6">
          {!isRunning && timeLeft === totalTargetSeconds && rounds.length === 0 && (
            <div className="space-y-4">
              <Label>Set Duration</Label>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Input
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                    min={0}
                    max={23}
                    className="text-center"
                  />
                  <span className="block text-center text-sm text-muted-foreground">Hours</span>
                </div>
                <div className="space-y-2">
                  <Input
                    type="number"
                    value={minutes}
                    onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                    min={0}
                    max={59}
                    className="text-center"
                  />
                  <span className="block text-center text-sm text-muted-foreground">Minutes</span>
                </div>
                <div className="space-y-2">
                  <Input
                    type="number"
                    value={seconds}
                    onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                    min={0}
                    max={59}
                    className="text-center"
                  />
                  <span className="block text-center text-sm text-muted-foreground">Seconds</span>
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            <div
              className={`inline-block rounded-lg px-8 py-4 text-6xl font-bold tabular-nums ${
                timeLeft === 0 ? "bg-destructive/20 text-destructive" : "bg-muted"
              }`}
            >
              {formatDuration(timeLeft)}
            </div>
            {isRunning && currentRoundStart !== null && (
              <p className="mt-2 text-sm text-muted-foreground">
                Round {rounds.length + 1}: {formatDuration(currentRoundDuration)}
              </p>
            )}
          </div>

          <div className="flex justify-center gap-3">
            {!isRunning ? (
              <Button onClick={startTimer} size="lg" className="min-w-[120px]">
                {timeLeft === totalTargetSeconds && rounds.length === 0 ? "Start" : "Resume"}
              </Button>
            ) : (
              <Button onClick={pauseTimer} size="lg" variant="outline" className="min-w-[120px]">
                Pause
              </Button>
            )}

            {rounds.length > 0 && (
              <Button onClick={recordRound} variant="secondary" size="lg">
                Round
              </Button>
            )}

            <Button onClick={resetTimer} variant="destructive" size="lg">
              Reset
            </Button>
          </div>

          {rounds.length > 0 && (
            <div className="mt-6 space-y-2">
              <h3 className="font-medium">Rounds</h3>
              <div className="space-y-1">
                {rounds.map((round) => (
                  <div
                    key={round.roundNumber}
                    className="flex justify-between rounded bg-muted/50 px-3 py-2 text-sm"
                  >
                    <span>Round {round.roundNumber}</span>
                    <span className="font-mono tabular-nums">
                      {formatDuration(round.durationSeconds)}
                    </span>
                  </div>
                ))}
              </div>

              {stats && (
                <div className="mt-2 rounded bg-muted/30 px-3 py-2 text-sm">
                  <div className="flex justify-between">
                    <span>Average</span>
                    <span className="font-mono tabular-nums">
                      {formatDuration(Math.round(stats.average))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Best</span>
                    <span className="font-mono tabular-nums">{formatDuration(stats.best)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Worst</span>
                    <span className="font-mono tabular-nums">{formatDuration(stats.worst)}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
