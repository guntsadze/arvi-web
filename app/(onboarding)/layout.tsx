"use client";

import { CenteredShell } from "@/components/layout/CenteredShell";
import { GlobalLoader } from "@/components/loaders/GlobalLoader";
import { useAppSelector } from "@/store/hooks";
import {
  selectIsAuthenticated,
  selectIsInitialized,
} from "@/store/slices/userSlice";

/**
 * Requires authentication. proxy.ts already redirects unauthenticated
 * requests to /login at the edge — this is just client-side
 * belt-and-suspenders for the brief window before that's confirmed, and
 * for client-side navigations that don't re-run the edge middleware.
 */
export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isInitialized = useAppSelector(selectIsInitialized);

  if (!isInitialized) {
    return <GlobalLoader />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <CenteredShell>{children}</CenteredShell>;
}
