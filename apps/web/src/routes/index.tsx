import { Link } from "@tanstack/react-router";
import { Card, CardDescription, CardHeader, CardTitle } from "@gymbutler/ui/components/card";
import { createFileRoute } from "@tanstack/react-router";

const features = [
  {
    title: "Weight Percentages",
    description: "Calculate training percentages from your working weight",
    href: "/percentages",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 3H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" />
        <path d="M12 8v8" />
        <path d="m9 12 3-3 3 3" />
      </svg>
    ),
  },
  {
    title: "Weight Converter",
    description: "Convert between kilograms and pounds instantly",
    href: "/convert",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 16V4M7 4L3 8M7 4L11 8" />
        <path d="M17 8V20M17 20L21 16M17 20L13 16" />
      </svg>
    ),
  },
  {
    title: "Timer",
    description: "Countdown timer with round tracking",
    href: "/timer",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    title: "Stopwatch",
    description: "Track your rest times with lap functionality",
    href: "/stopwatch",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="13" r="8" />
        <path d="M12 9v4l2 2" />
        <path d="M5 3 2 6" />
        <path d="M22 6l-3-3" />
        <path d="M6 19l-2 2" />
        <path d="M18 19l-2 2" />
      </svg>
    ),
  },
];

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Gym Butler</h1>
        <p className="text-lg text-muted-foreground">
          Your all-in-one gym companion for calculating percentages, converting weights, and timing
          your workouts
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {features.map((feature) => (
          <Link key={feature.href} to={feature.href} className="block">
            <Card className="h-full transition-all hover:border-primary hover:shadow-md">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
