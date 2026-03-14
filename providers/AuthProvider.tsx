"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setUser, clearUser } from "@/store/slices/userSlice";
import { authService } from "@/services/auth/auth.services";
import { usePathname } from "next/navigation";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

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

  return <>{children}</>;
}
