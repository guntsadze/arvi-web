"use client";
import dynamic from "next/dynamic";

const ReduxProvider = dynamic(
  () => import("@/providers/ReduxProvider").then((m) => m.ReduxProvider),
  { ssr: false },
);

const AuthProvider = dynamic(
  () => import("@/providers/AuthProvider").then((m) => m.AuthProvider),
  { ssr: false },
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <AuthProvider>{children}</AuthProvider>
    </ReduxProvider>
  );
}
