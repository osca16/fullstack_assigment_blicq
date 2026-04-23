import { loginWithGoogle } from "@/src/actions/auth.actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { auth } from "@/src/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md shadow-xl border">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-semibold">
            Welcome Back
          </CardTitle>
          <CardDescription>
            Sign in to continue to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form action={loginWithGoogle} className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              variant="outline"
            >
              {/* Google Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="w-5 h-5"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.4 0 6.4 1.2 8.8 3.5l6.6-6.6C35.6 2.3 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.3l7.7 6C12.3 13.3 17.7 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.1 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.4c-.5 2.7-2 5-4.2 6.6l6.5 5c3.8-3.5 6.4-8.7 6.4-15.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.3 28.7c-1-2.9-1-6.1 0-9l-7.7-6C.9 17.1 0 20.5 0 24s.9 6.9 2.6 10.3l7.7-5.6z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.2 0 11.4-2 15.2-5.4l-6.5-5c-2 1.4-4.6 2.2-8.7 2.2-6.3 0-11.7-3.8-13.7-9.8l-7.7 5.6C6.5 42.6 14.6 48 24 48z"
                />
              </svg>

              Continue with Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}