import { useEffect, useState } from "react";

/** Date.now(), refreshed every `intervalMs` while non-null. */
export function useNow(intervalMs: number | null): number {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    setNow(Date.now());
    if (intervalMs === null) return;
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}
