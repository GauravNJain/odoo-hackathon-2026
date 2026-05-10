import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4">
      <span className="text-7xl mb-4">🧭</span>
      <h1 className="font-display text-4xl font-bold text-ink-primary">Page Not Found</h1>
      <p className="mt-2 text-ink-secondary text-center max-w-md">
        Looks like you&apos;ve wandered off the beaten path. Let&apos;s get you back on track.
      </p>
      <Link href="/dashboard" className="mt-6">
        <Button className="bg-brand-500 hover:bg-brand-600 text-white">
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
