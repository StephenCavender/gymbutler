import { useConvexAuth, useMutation } from "convex/react";
import type { FunctionArgs, FunctionReference } from "convex/server";
import { useCallback } from "react";
import { toast } from "sonner";

/** Returns a function that saves a session to the account; a no-op when signed out or given null. */
export function useSessionLogger<M extends FunctionReference<"mutation">>(mutation: M) {
  const { isAuthenticated } = useConvexAuth();
  const save = useMutation(mutation);
  return useCallback(
    (session: FunctionArgs<M> | null) => {
      if (!session || !isAuthenticated) return;
      save(session).then(
        () => toast.success("Session saved"),
        () => toast.error("Couldn't save this session"),
      );
    },
    [isAuthenticated, save],
  );
}
