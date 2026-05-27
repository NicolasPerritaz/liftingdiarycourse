import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Lifting Diary
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Track your workouts and progress over time.
        </p>
        <div className="flex gap-4">
          <SignInButton>
            <Button variant="default">Sign in</Button>
          </SignInButton>
          <SignUpButton>
            <Button variant="outline">Sign up</Button>
          </SignUpButton>
        </div>
      </main>
    </div>
  );
}
