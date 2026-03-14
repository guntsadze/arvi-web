"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setUser,
  clearUser,
  selectIsAuthenticated,
} from "@/store/slices/userSlice";
import { authService } from "@/services/auth/auth.services";
import { usePathname } from "next/navigation";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAuthPage = pathname?.startsWith("/auth");

  useEffect(() => {
    if (isAuthPage) return;

    const initAuth = async () => {
      try {
        const user = await authService.getMe();
        dispatch(setUser({ user }));
      } catch {
        dispatch(clearUser());
      }
    };

    initAuth();
  }, [dispatch, isAuthPage]);

  useEffect(() => {
    if (!isAuthenticated || isAuthPage) return;

    const interval = setInterval(
      async () => {
        try {
          await authService.refreshToken();
          console.log("🔄 Token refreshed");
        } catch {
          dispatch(clearUser());
          window.location.href = "/auth/login";
        }
      },
      40 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [isAuthenticated, isAuthPage, dispatch]);

  return <>{children}</>;
}
