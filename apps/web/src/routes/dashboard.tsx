import { api } from "@gymbutler/backend/convex/_generated/api";
import { Card, CardHeader, CardTitle } from "@gymbutler/ui/components/card";
import { createFileRoute } from "@tanstack/react-router";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@gymbutler/ui/components/button";
import UserMenu from "@/components/user-menu";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Authenticated>
        <AuthenticatedDashboard />
      </Authenticated>
      <Unauthenticated>
        <UnauthenticatedDashboard />
      </Unauthenticated>
    </div>
  );
}

function AuthenticatedDashboard() {
  const navigate = useNavigate();
  const recentPercentages = useQuery(api.percentages.getRecent, { limit: 5 });
  const recentConversions = useQuery(api.conversions.getRecent, { limit: 5 });
  const recentTimerSessions = useQuery(api.timer.getRecent, { limit: 3 });
  const recentStopwatchSessions = useQuery(api.stopwatch.getRecent, { limit: 3 });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <UserMenu />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <CardHeader className="p-0 mb-4">
            <div className="flex items-center justify-between">
              <CardTitle>Percentages</CardTitle>
              <Link to="/percentages">
                <Button variant="outline" size="sm">New</Button>
              </Link>
            </div>
          </CardHeader>
          {recentPercentages && recentPercentages.length > 0 ? (
            <div className="space-y-2">
              {recentPercentages.slice(0, 3).map((entry) => (
                <div key={entry._id} className="flex justify-between rounded bg-muted/50 px-3 py-2 text-sm">
                  <span>{entry.weight} {entry.unit}</span>
                  <span className="text-muted-foreground">
                    {entry.results.length} values
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No recent entries</p>
          )}
        </Card>

        <Card className="p-6">
          <CardHeader className="p-0 mb-4">
            <div className="flex items-center justify-between">
              <CardTitle>Conversions</CardTitle>
              <Link to="/convert">
                <Button variant="outline" size="sm">New</Button>
              </Link>
            </div>
          </CardHeader>
          {recentConversions && recentConversions.length > 0 ? (
            <div className="space-y-2">
              {recentConversions.slice(0, 3).map((entry) => (
                <div key={entry._id} className="flex justify-between rounded bg-muted/50 px-3 py-2 text-sm">
                  <span>{entry.fromWeight} {entry.fromUnit}</span>
                  <span className="text-muted-foreground">→ {entry.toWeight.toFixed(1)} {entry.toUnit}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No recent conversions</p>
          )}
        </Card>

        <Card className="p-6">
          <CardHeader className="p-0 mb-4">
            <div className="flex items-center justify-between">
              <CardTitle>Timer Sessions</CardTitle>
              <Link to="/timer">
                <Button variant="outline" size="sm">New</Button>
              </Link>
            </div>
          </CardHeader>
          {recentTimerSessions && recentTimerSessions.length > 0 ? (
            <div className="space-y-2">
              {recentTimerSessions.slice(0, 3).map((session) => (
                <div key={session._id} className="flex justify-between rounded bg-muted/50 px-3 py-2 text-sm">
                  <span>{session.rounds.length} rounds</span>
                  <span className="text-muted-foreground">
                    {formatSeconds(session.totalSeconds)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No recent sessions</p>
          )}
        </Card>

        <Card className="p-6">
          <CardHeader className="p-0 mb-4">
            <div className="flex items-center justify-between">
              <CardTitle>Stopwatch Sessions</CardTitle>
              <Link to="/stopwatch">
                <Button variant="outline" size="sm">New</Button>
              </Link>
            </div>
          </CardHeader>
          {recentStopwatchSessions && recentStopwatchSessions.length > 0 ? (
            <div className="space-y-2">
              {recentStopwatchSessions.slice(0, 3).map((session) => (
                <div key={session._id} className="flex justify-between rounded bg-muted/50 px-3 py-2 text-sm">
                  <span>{session.laps.length} laps</span>
                  <span className="text-muted-foreground">
                    {formatSeconds(session.totalTimeSeconds)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No recent sessions</p>
          )}
        </Card>
      </div>
    </div>
  );
}

function UnauthenticatedDashboard() {
  return (
    <div className="space-y-6 text-center">
      <h1 className="text-3xl font-bold">Welcome to Gym Butler</h1>
      <p className="text-muted-foreground">
        Sign in to save your workout history and sync across devices
      </p>
      <div className="flex justify-center gap-4">
        <Link to="/sign-in">
          <Button>Sign In</Button>
        </Link>
        <Link to="/sign-up">
          <Button variant="outline">Sign Up</Button>
        </Link>
      </div>
    </div>
  );
}

function formatSeconds(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}