import { Button } from "@gymbutler/ui/components/button";
import { Card } from "@gymbutler/ui/components/card";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/stopwatch")({
  component: StopwatchPage,
});

interface Lap {
  lapNumber: number;
  lapTimeSeconds: number;
  totalTimeSeconds: number;
  timestamp: number;
}

function StopwatchPage() {
  const { t } = useTranslation();
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [laps, setLaps] = useState<Lap[]>([]);
  const [sessionStart, setSessionStart] = useState<number | null>(null);

  const intervalRef = useRef<number | null>(null);

  const startStopwatch = useCallback(() => {
    setIsRunning(true);
    if (sessionStart === null) {
      setSessionStart(Date.now());
    }
  }, [sessionStart]);

  const recordLap = useCallback(() => {
    if (sessionStart !== null) {
      const totalSeconds = (Date.now() - sessionStart) / 1000;
      const lastLapTime = laps.length > 0 ? laps[laps.length - 1].totalTimeSeconds : 0;
      const lapTime = totalSeconds - lastLapTime;

      setLaps((prev) => [
        ...prev,
        {
          lapNumber: prev.length + 1,
          lapTimeSeconds: lapTime,
          totalTimeSeconds: totalSeconds,
          timestamp: Date.now(),
        },
      ]);
    }
  }, [laps, sessionStart]);

  const stopStopwatch = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetStopwatch = useCallback(() => {
    setIsRunning(false);
    setTotalTime(0);
    setLaps([]);
    setSessionStart(null);
  }, []);

  useEffect(() => {
    if (isRunning && sessionStart !== null) {
      intervalRef.current = window.setInterval(() => {
        const elapsed = (Date.now() - sessionStart) / 1000;
        setTotalTime(elapsed);
      }, 10);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, sessionStart]);

  const formatTime = (totalSeconds: number): string => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);
    const ms = Math.floor((totalSeconds % 1) * 100);

    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
  };

  const getCurrentLapTime = (): number => {
    if (laps.length > 0) {
      return totalTime - laps[laps.length - 1].totalTimeSeconds;
    }
    return totalTime;
  };

  const getLapStats = () => {
    if (laps.length < 2) return null;

    const lapTimes = laps.map((lap) => lap.lapTimeSeconds);
    return {
      average: lapTimes.reduce((a, b) => a + b, 0) / lapTimes.length,
      best: Math.min(...lapTimes),
      worst: Math.max(...lapTimes),
    };
  };

  const stats = getLapStats();

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-6 text-3xl font-bold">{t('stopwatch.title')}</h1>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <div className="mb-2 text-sm text-muted-foreground">
              {t('stopwatch.totalTime')}
            </div>
            <div className="inline-block rounded-lg bg-muted px-8 py-4 text-5xl font-bold tabular-nums md:text-6xl">
              {formatTime(totalTime)}
            </div>

            <div className="mt-2 text-sm text-muted-foreground">
              {t('stopwatch.currentLap')}: {formatTime(getCurrentLapTime())}
            </div>
          </div>

          <div className="flex justify-center gap-3">
            {!isRunning ? (
              <Button onClick={startStopwatch} size="lg" className="min-w-[120px]">
                {totalTime === 0 ? t('stopwatch.start') : t('stopwatch.resume')}
              </Button>
            ) : (
              <Button onClick={stopStopwatch} size="lg" variant="outline" className="min-w-[120px]">
                {t('stopwatch.stop')}
              </Button>
            )}

            <Button
              onClick={recordLap}
              variant="secondary"
              size="lg"
              disabled={!isRunning}
            >
              {t('stopwatch.lap')}
            </Button>

            <Button
              onClick={resetStopwatch}
              variant="destructive"
              size="lg"
              disabled={totalTime === 0}
            >
              {t('stopwatch.reset')}
            </Button>
          </div>

          {laps.length > 0 && (
            <div className="mt-6 space-y-2">
              <h3 className="font-medium">{t('stopwatch.laps')}</h3>
              <div className="max-h-[300px] space-y-1 overflow-y-auto">
                {laps
                  .slice()
                  .reverse()
                  .map((lap) => (
                    <div
                      key={lap.lapNumber}
                      className="flex justify-between rounded bg-muted/50 px-3 py-2 text-sm"
                    >
                      <span>{t('stopwatch.lap')} {lap.lapNumber}</span>
                      <span className="font-mono tabular-nums">
                        {formatTime(lap.lapTimeSeconds)}
                      </span>
                    </div>
                  ))}
              </div>

              {stats && (
                <div className="mt-2 rounded bg-muted/30 px-3 py-2 text-sm">
                  <div className="flex justify-between">
                    <span>{t('stopwatch.average')}</span>
                    <span className="font-mono tabular-nums">
                      {formatTime(stats.average)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('stopwatch.best')}</span>
                    <span className="font-mono tabular-nums text-green-600 dark:text-green-400">
                      {formatTime(stats.best)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('stopwatch.worst')}</span>
                    <span className="font-mono tabular-nums text-red-600 dark:text-red-400">
                      {formatTime(stats.worst)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {laps.length === 0 && !isRunning && totalTime === 0 && (
            <div className="text-center text-muted-foreground">
              {t('stopwatch.noLaps')}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
