"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthRequiredDetail {
  returnTo?: string;
}

/**
 * There's no more password re-auth dialog — the only auth surface is
 * /login (Google or Phone+OTP). lib/api.ts's axios interceptor dispatches
 * "AUTH_REQUIRED" when a refresh attempt fails (session is dead); this
 * listener just sends the user to /login, preserving where they were so
 * they can be dropped back after they re-authenticate.
 */
export function AuthModal() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthRequired = (event: Event) => {
      const detail = (event as CustomEvent<AuthRequiredDetail>).detail;
      const returnTo = detail?.returnTo;
      const target =
        returnTo && returnTo !== "/login"
          ? `/login?redirect=${encodeURIComponent(returnTo)}`
          : "/login";
      router.push(target);
    };

    window.addEventListener("AUTH_REQUIRED", handleAuthRequired);
    return () =>
      window.removeEventListener("AUTH_REQUIRED", handleAuthRequired);
  }, [router]);

  return null;
}
