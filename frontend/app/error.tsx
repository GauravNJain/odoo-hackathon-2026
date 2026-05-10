"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4">
      <span className="text-6xl mb-4">⚠️</span>
      <h2 className="font-display text-2xl font-bold text-ink-primary">Something went wrong</h2>
      <p className="mt-2 text-sm text-ink-secondary max-w-md text-center">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <Button
        onClick={reset}
        className="mt-6 bg-brand-500 hover:bg-brand-600 text-white"
      >
        Try Again
      </Button>
    </div>
  );
}
