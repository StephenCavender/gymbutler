import { Card, CardHeader, CardTitle } from "@gymbutler/ui/components/card";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button } from "@gymbutler/ui/components/button";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { t } = useTranslation();

  const tools = [
    {
      key: 'nav.percentages',
      to: '/percentages',
      description: t('home.percentagesDesc'),
    },
    {
      key: 'nav.convert',
      to: '/convert',
      description: t('home.convertDesc'),
    },
    {
      key: 'nav.timer',
      to: '/timer',
      description: t('home.timerDesc'),
    },
    {
      key: 'nav.stopwatch',
      to: '/stopwatch',
      description: t('home.stopwatchDesc'),
    },
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">{t('dashboard.title')}</h1>
      <p className="mb-6 text-muted-foreground">{t('dashboard.subtitle')}</p>

      <div className="grid gap-6 md:grid-cols-2">
        {tools.map((tool) => (
          <Card key={tool.to} className="p-6">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center justify-between">
                <CardTitle>{t(tool.key)}</CardTitle>
                <Link to={tool.to}>
                  <Button variant="outline" size="sm">{t('dashboard.open')}</Button>
                </Link>
              </div>
            </CardHeader>
            <p className="text-sm text-muted-foreground">
              {tool.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
