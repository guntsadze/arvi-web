"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { clearUser } from "@/store/slices/userSlice";

interface AuthRequiredDetail {
  returnTo?: string;
}

/**
 * There's no more password re-auth dialog — the only auth surface is
 * /login (Google or Phone+OTP). lib/api.ts's axios interceptor dispatches
 * "AUTH_REQUIRED" when a refresh attempt fails (session is dead); this
 * listener clears the (now stale) Redux auth state and sends the user to
 * /login, preserving where they were so they can be dropped back after
 * they re-authenticate.
 */
export function AuthModal() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleAuthRequired = (event: Event) => {
      const detail = (event as CustomEvent<AuthRequiredDetail>).detail;
      const returnTo = detail?.returnTo;
      const target =
        returnTo && returnTo !== "/login"
          ? `/login?redirect=${encodeURIComponent(returnTo)}`
          : "/login";

      // A failed refresh means the session is dead — clear the stale
      // isAuthenticated/currentUser state before/while redirecting so no
      // consumer keeps acting on a session that no longer exists.
      dispatch(clearUser());
      router.push(target);
    };

    window.addEventListener("AUTH_REQUIRED", handleAuthRequired);
    return () =>
      window.removeEventListener("AUTH_REQUIRED", handleAuthRequired);
  }, [router, dispatch]);

  return null;
}
