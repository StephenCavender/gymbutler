import { Card, CardHeader, CardTitle } from "@gymbutler/ui/components/card";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button } from "@gymbutler/ui/components/button";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <CardHeader className="p-0 mb-4">
            <div className="flex items-center justify-between">
              <CardTitle>Percentages</CardTitle>
              <Link to="/percentages">
                <Button variant="outline" size="sm">
                  Open
                </Button>
              </Link>
            </div>
          </CardHeader>
          <p className="text-sm text-muted-foreground">
            Calculate training percentages from your working weight
          </p>
        </Card>

        <Card className="p-6">
          <CardHeader className="p-0 mb-4">
            <div className="flex items-center justify-between">
              <CardTitle>Weight Converter</CardTitle>
              <Link to="/convert">
                <Button variant="outline" size="sm">
                  Open
                </Button>
              </Link>
            </div>
          </CardHeader>
          <p className="text-sm text-muted-foreground">
            Convert between kilograms and pounds instantly
          </p>
        </Card>

        <Card className="p-6">
          <CardHeader className="p-0 mb-4">
            <div className="flex items-center justify-between">
              <CardTitle>Timer</CardTitle>
              <Link to="/timer">
                <Button variant="outline" size="sm">
                  Open
                </Button>
              </Link>
            </div>
          </CardHeader>
          <p className="text-sm text-muted-foreground">Countdown timer with round tracking</p>
        </Card>

        <Card className="p-6">
          <CardHeader className="p-0 mb-4">
            <div className="flex items-center justify-between">
              <CardTitle>Stopwatch</CardTitle>
              <Link to="/stopwatch">
                <Button variant="outline" size="sm">
                  Open
                </Button>
              </Link>
            </div>
          </CardHeader>
          <p className="text-sm text-muted-foreground">Track rest times with lap functionality</p>
        </Card>
      </div>
    </div>
  );
}
