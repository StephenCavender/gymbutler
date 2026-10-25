import { Link } from "@tanstack/react-router";
import { useConvexAuth } from "convex/react";

export interface SessionSummary {
  id: string;
  createdAt: number;
  summary: string;
  detail?: string;
}

/** The signed-in user's latest sessions, or a prompt to sign in. */
export function RecentSessions({ sessions }: { sessions: SessionSummary[] | undefined }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  if (isLoading) return null;

  return (
    <section className="mt-6 space-y-2" aria-labelledby="recent-sessions">
      <h2 id="recent-sessions" className="font-medium">
        Recent sessions
      </h2>
      {!isAuthenticated ? (
        <p className="text-sm text-muted-foreground">
          <Link to="/login" className="underline">
            Sign in
          </Link>{" "}
          to keep a log of your sessions.
        </p>
      ) : sessions === undefined ? null : sessions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No sessions yet.</p>
      ) : (
        <ul className="space-y-1">
          {sessions.map((s) => (
            <li
              key={s.id}
              className="flex justify-between gap-4 rounded bg-muted/50 px-3 py-2 text-sm"
            >
              <span>
                {new Date(s.createdAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
              <span className="text-right">
                <span className="font-mono tabular-nums">{s.summary}</span>
                {s.detail && <span className="text-muted-foreground"> · {s.detail}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
