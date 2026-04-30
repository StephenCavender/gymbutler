import { Button } from "@gymbutler/ui/components/button";
import { Card } from "@gymbutler/ui/components/card";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  const { t } = useTranslation();

  const features = [
    {
      key: 'about.features.percentages',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 3H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" />
          <path d="M12 8v8" />
          <path d="m9 12 3-3 3 3" />
        </svg>
      ),
    },
    {
      key: 'about.features.convert',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 16V4M7 4L3 8M7 4L11 8" />
          <path d="M17 8V20M17 20L21 16M17 20L13 16" />
        </svg>
      ),
    },
    {
      key: 'about.features.timer',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      key: 'about.features.stopwatch',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="13" r="8" />
          <path d="M12 9v4l2 2" />
          <path d="M5 3 2 6" /><path d="M22 6l-3-3" /><path d="M6 19l-2 2" /><path d="M18 19l-2 2" />
        </svg>
      ),
    },
  ];

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
        <h1 className="mb-2 text-4xl font-bold">{t('about.title')}</h1>
        <p className="text-lg text-muted-foreground">
          {t('about.description')}
        </p>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">{t('dashboard.title')}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature, index) => (
              <div key={index}>
                <h3 className="mb-2 flex items-center gap-2 font-medium text-primary">
                  {feature.icon}
                  {t(feature.key)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(feature.key)}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">{t('about.contact')}</h2>
          <p className="mb-4 text-muted-foreground">
            {t('about.contactDesc')}{' '}
            <a
              href={`mailto:${t('about.email')}`}
              className="text-primary hover:underline"
            >
              {t('about.email')}
            </a>
            .
          </p>
          <p className="text-muted-foreground">
            GymButler is built with ♥ by{' '}
            <a
              href="https://cavender.io"
              className="text-primary hover:underline"
            >
              Stephen Cavender
            </a>
            .
          </p>
        </Card>

        <div className="text-center">
          <Link to="/">
            <Button variant="outline">{t('nav.dashboard')}</Button>
          </Link>
        </div>

        <div className="flex justify-center gap-4 text-sm text-muted-foreground">
          <Link to="/terms" className="hover:text-foreground">
            {t('nav.terms')}
          </Link>
          <Link to="/privacy" className="hover:text-foreground">
            {t('nav.privacy')}
          </Link>
        </div>
      </div>
    </div>
  );
}
