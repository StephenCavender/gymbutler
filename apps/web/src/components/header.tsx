import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { ModeToggle } from "./mode-toggle";

const navLinks = [
  { to: "/percentages", labelKey: "nav.percentages" },
  { to: "/convert", labelKey: "nav.convert" },
  { to: "/timer", labelKey: "nav.timer" },
  { to: "/stopwatch", labelKey: "nav.stopwatch" },
  { to: "/about", labelKey: "nav.about" },
  { to: "/settings", labelKey: "nav.settings" },
] as const;

export default function Header() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { t } = useTranslation();

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-4 py-2">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold">
            {t('app.name')}
          </Link>
          <nav className="hidden gap-1 md:flex">
            {navLinks.map(({ to, labelKey }) => {
              const isActive = currentPath === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`rounded px-3 py-1.5 text-sm transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {t(labelKey)}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>

      {/* Mobile navigation */}
      <nav className="flex gap-1 overflow-x-auto px-4 pb-2 md:hidden">
        {navLinks.map(({ to, labelKey }) => {
          const isActive = currentPath === to;
          return (
            <Link
              key={to}
              to={to}
              className={`shrink-0 rounded px-3 py-1.5 text-sm transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {t(labelKey)}
            </Link>
          );
        })}
      </nav>

      <hr />
    </div>
  );
}
