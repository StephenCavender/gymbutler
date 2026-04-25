import { createFileRoute, Link } from "@tanstack/react-router";
import SignUpForm from "@/components/sign-up-form";
import { Button } from "@gymbutler/ui/components/button";

export const Route = createFileRoute("/sign-up")({
  component: SignUpPage,
});

function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100vh-100px)] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <SignUpForm
          onSwitchToSignIn={() => {}}
        />
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-primary hover:underline">
              <Button variant="link" className="h-auto p-0 text-primary">
                Sign In
              </Button>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}