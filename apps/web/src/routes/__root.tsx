import { Toaster } from "@gymbutler/ui/components/sonner";
import { HeadContent, Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import Header from "@/components/header";
import { SettingsProvider } from "@/components/settings-provider";
import { ThemeProvider } from "@/components/theme-provider";

import "../index.css";

export interface RouterAppContext {}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: "GymButler",
      },
      {
        name: "description",
        content: "Weightlifting percentage tables, at a glance.",
      },
    ],
  }),
});

function RootComponent() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="gymbutler-theme"
    >
      <HeadContent />
      {/* grid-cols-1 is minmax(0, 1fr): without it the column grows to fit the
          scrollable mobile nav and every page overflows on phones. */}
      <SettingsProvider>
        <div className="grid h-svh grid-cols-1 grid-rows-[auto_1fr]">
          <Header />
          <Outlet />
        </div>
      </SettingsProvider>
      <Toaster richColors />
      <TanStackRouterDevtools position="bottom-left" />
    </ThemeProvider>
  );
}
