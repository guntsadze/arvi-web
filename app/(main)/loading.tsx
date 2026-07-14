/**
 * Skeleton for the (main) route segment's content area only. MainLayout
 * (app/(main)/layout.tsx) renders Sidebar/RightPanel synchronously — it
 * doesn't suspend — so Next.js's automatic Suspense boundary around
 * `{children}` only ever swaps out the <main> content, not the chrome.
 * This mirrors that: no sidebar/right-panel here, just post-card-shaped
 * blocks matching the feed's centered content column.
 */
export default function MainLoading() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 px-4 py-10">
      <div className="h-24 animate-pulse rounded-xl border border-border bg-surface-1" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="space-y-4 rounded-xl border border-border bg-surface-1 p-5"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-full bg-surface-2" />
            <div className="space-y-2">
              <div className="h-3 w-32 animate-pulse rounded-md bg-surface-2" />
              <div className="h-2.5 w-20 animate-pulse rounded-md bg-surface-2" />
            </div>
          </div>
          <div className="h-40 w-full animate-pulse rounded-lg bg-surface-2" />
          <div className="space-y-2">
            <div className="h-3 w-full animate-pulse rounded-md bg-surface-2" />
            <div className="h-3 w-4/5 animate-pulse rounded-md bg-surface-2" />
          </div>
        </div>
      ))}
    </div>
  );
}
