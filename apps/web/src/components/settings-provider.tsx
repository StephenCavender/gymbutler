import { api } from "@gymbutler/backend/convex/_generated/api";
import {
  settingsError,
  withDefaults,
  type Settings,
} from "@gymbutler/backend/convex/model/settings";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { readLocalSettings, writeLocalSettings } from "@/lib/local-settings";

interface SettingsContextValue {
  settings: Settings;
  /** Where changes are saved: this device, or the signed-in account. */
  savedTo: "device" | "account";
  /** Save a change; invalid changes are rejected with a toast and not applied. */
  update: (change: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

/**
 * Signed out, settings live on this device. Signed in, they live on the
 * account (mirrored to the device), and the first sign-in uploads the
 * device's settings if the account has none.
 */
export function SettingsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useConvexAuth();
  const remote = useQuery(api.settings.get, isAuthenticated ? {} : "skip");
  const upsert = useMutation(api.settings.upsert).withOptimisticUpdate((store, change) => {
    const current = store.getQuery(api.settings.get, {});
    if (current !== undefined) store.setQuery(api.settings.get, {}, { ...current, ...change });
  });
  const [local, setLocal] = useState(() => readLocalSettings(localStorage));

  // While the account's settings load, or when it has none, show the device's.
  const settings = withDefaults(isAuthenticated && remote ? remote : local);

  useEffect(() => {
    if (isAuthenticated && remote === null && Object.keys(local).length > 0) {
      upsert(local).catch(() => {
        // Device settings the server rejects stay on the device only.
      });
    }
    // Only when the account turns out to be empty, not on every local change.
  }, [isAuthenticated, remote === null]);

  const update = useCallback(
    (change: Partial<Settings>) => {
      const error = settingsError({ ...settings, ...change });
      if (error) {
        toast.error(error);
        return;
      }
      writeLocalSettings(localStorage, change);
      setLocal((prev) => ({ ...prev, ...change }));
      if (isAuthenticated) {
        upsert(change).catch((e: unknown) => {
          toast.error(e instanceof Error ? e.message : "Couldn't save settings");
        });
      }
    },
    [settings, isAuthenticated, upsert],
  );

  return (
    <SettingsContext.Provider
      value={{ settings, savedTo: isAuthenticated ? "account" : "device", update }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const value = useContext(SettingsContext);
  if (!value) throw new Error("useSettings must be used inside <SettingsProvider>");
  return value;
}
