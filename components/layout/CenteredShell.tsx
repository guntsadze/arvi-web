/**
 * Full-viewport centered wrapper shared by route groups that render a
 * single card with no chrome (no sidebar, no header) — e.g. (auth) and
 * (onboarding). Purely a layout shell; carries no auth logic of its own.
 */
export function CenteredShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      {children}
    </div>
  );
}
