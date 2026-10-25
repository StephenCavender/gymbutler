import { Button } from "@gymbutler/ui/components/button";
import { Card } from "@gymbutler/ui/components/card";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-block rounded-full bg-primary/10 p-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="M16 3H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" />
            <path d="M12 8v8" />
            <path d="m9 12 3-3 3 3" />
          </svg>
        </div>
        <h1 className="mb-2 text-4xl font-bold">About GymButler</h1>
        <p className="text-lg text-muted-foreground">Your all-in-one gym companion</p>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Features</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-medium text-primary">Weight Percentages</h3>
              <p className="text-sm text-muted-foreground">
                Calculate training percentages from your working weight with customizable ranges.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-medium text-primary">Weight Converter</h3>
              <p className="text-sm text-muted-foreground">
                Convert between kilograms and pounds instantly with handy conversion tips.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-medium text-primary">Timer</h3>
              <p className="text-sm text-muted-foreground">
                Countdown timer with round tracking for interval training.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-medium text-primary">Stopwatch</h3>
              <p className="text-sm text-muted-foreground">
                Track rest times with lap functionality and statistics.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Available On</h2>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://apps.apple.com/us/app/gymbutler/id1613277271"
              className="inline-block transition-opacity hover:opacity-80"
            >
              <img
                src="/assets/app-store-badge.svg"
                alt="Download on the App Store"
                className="h-12"
              />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.gymbutler"
              className="inline-block transition-opacity hover:opacity-80"
            >
              <img
                src="/assets/google-play-badge.png"
                alt="Get it on Google Play"
                className="h-12"
              />
            </a>
            <a
              href="https://app.gymbutler.cavender.dev"
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors hover:bg-muted"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              Web App
            </a>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Contact</h2>
          <p className="mb-4 text-muted-foreground">
            Questions, suggestions, or feedback? Reach out at{" "}
            <a href="mailto:gymbutler@cavender.io" className="text-primary hover:underline">
              gymbutler@cavender.io
            </a>
            .
          </p>
          <p className="text-muted-foreground">
            GymButler is built with ♥ by{" "}
            <a href="https://cavender.io" className="text-primary hover:underline">
              Stephen Cavender
            </a>
            .
          </p>
        </Card>

        <div className="text-center">
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>

        <div className="flex justify-center gap-4 text-sm text-muted-foreground">
          <a href="https://gymbutler.cavender.io/terms/" className="hover:text-foreground">
            Terms & Conditions
          </a>
          <a href="https://gymbutler.cavender.io/privacy/" className="hover:text-foreground">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
