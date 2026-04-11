"use client";

import { RightPanel } from "@/components/layout/RightPanel";
import { Sidebar } from "@/components/layout/Sidebar";
import { FloatingChatsContainer } from "@/components/messaging/FloatingChatsContainer";
import { GlobalLoader } from "@/components/loaders/GlobalLoader";
import { useAppSelector } from "@/store/hooks";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isInitialized } = useAppSelector(
    (state) => state.user,
  );

  if (!isInitialized) {
    return <GlobalLoader />;
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
