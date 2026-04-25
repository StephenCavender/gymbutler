import { createFileRoute, Link } from "@tanstack/react-router";
import SignInForm from "@/components/sign-in-form";
import { Button } from "@gymbutler/ui/components/button";

export const Route = createFileRoute("/sign-in")({
  component: SignInPage,
});

function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-100px)] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <SignInForm
          onSwitchToSignUp={() => {}}
        />
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/sign-up" className="text-primary hover:underline">
              <Button variant="link" className="h-auto p-0 text-primary">
                Sign Up
              </Button>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}