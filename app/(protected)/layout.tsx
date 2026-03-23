"use client";

import { RightPanel } from "@/components/layout/RightPanel";
import { Sidebar } from "@/components/layout/Sidebar";
import { FloatingChatsContainer } from "@/components/messaging/FloatingChatsContainer";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isInitialized } = useAppSelector(
    (state) => state.user,
  );

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen bg-[#0a0a0a] items-center justify-center">
        <div className="animate-pulse text-stone-500 font-mono text-xs uppercase">
          Verifying Session...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="flex-1">{children}</main>
      <RightPanel />
      <FloatingChatsContainer />
    </div>
  );
}
