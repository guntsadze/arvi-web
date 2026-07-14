"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { RightPanel } from "@/components/layout/RightPanel";
import { FloatingChatsContainer } from "@/components/messaging/FloatingChatsContainer";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/store/slices/userSlice";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 border-x border-border">{children}</main>

      {isAuthenticated && (
        <>
          <RightPanel />
          <FloatingChatsContainer />
        </>
      )}
    </div>
  );
}
