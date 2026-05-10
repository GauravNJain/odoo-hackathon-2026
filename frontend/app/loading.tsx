export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-canvas">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-brand-200 border-t-brand-500" />
        <p className="text-sm text-ink-secondary animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
