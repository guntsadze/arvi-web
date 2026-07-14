/**
 * Skeleton shown while an (onboarding) route segment is loading. Mirrors
 * the dimensions of the onboarding card (see app/(onboarding)/garage/
 * page.tsx): max-w-2xl, rounded-xl, surface-1, p-8, centered by
 * CenteredShell (this file renders inside the layout's CenteredShell).
 */
export default function OnboardingLoading() {
  return (
    <div className="w-full max-w-2xl py-12">
      <div className="mb-4 flex justify-end">
        <div className="h-4 w-40 animate-pulse rounded-md bg-surface-2" />
      </div>

      <div className="rounded-xl border border-border bg-surface-1 p-8 shadow-2xl shadow-black/30">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-12 w-12 shrink-0 animate-pulse rounded-md bg-surface-2" />
          <div className="space-y-2">
            <div className="h-5 w-56 animate-pulse rounded-md bg-surface-2" />
            <div className="h-3.5 w-44 animate-pulse rounded-md bg-surface-2" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-20 animate-pulse rounded-md bg-surface-2" />
                <div className="h-10 w-full animate-pulse rounded-md bg-surface-2" />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 border-t border-border pt-6">
            <div className="h-10 w-24 animate-pulse rounded-md bg-surface-2" />
            <div className="h-10 w-32 animate-pulse rounded-md bg-surface-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
