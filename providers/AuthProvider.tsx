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
import { AUTH_ROUTES } from "@/constants/routes";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (AUTH_ROUTES.includes(pathname)) return;
    if (isAuthenticated) return;
    const initAuth = async () => {
      try {
        const user = await authService.getMe();
        dispatch(setUser({ user }));
      } catch {
        dispatch(clearUser());
      }
    };
    initAuth();
  }, [dispatch, isAuthenticated, pathname]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(
      async () => {
        try {
          await authService.refreshToken();
          console.log("🔄 Token refreshed");
        } catch {
          dispatch(clearUser());
        }
      },
      40 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [isAuthenticated, dispatch]);

  return <>{children}</>;
}
