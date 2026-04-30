import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

import { ModeToggle } from "./mode-toggle";

const navLinks = [
  { to: "/percentages", label: "Percentages" },
  { to: "/convert", label: "Convert" },
  { to: "/timer", label: "Timer" },
  { to: "/stopwatch", label: "Stopwatch" },
  { to: "/about", label: "About" },
  { to: "/settings", label: "Settings" },
] as const;

export default function Header() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-4 py-2">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold">
            GymButler
          </Link>
          <nav className="hidden gap-1 md:flex">
            {navLinks.map(({ to, label }) => {
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
                  {label}
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
        {navLinks.map(({ to, label }) => {
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
              {label}
            </Link>
          );
        })}
      </nav>

      <hr />
    </div>
  );
}