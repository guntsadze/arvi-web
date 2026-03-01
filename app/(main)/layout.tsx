import { Sidebar } from "@/components/layout/Sidebar";
import { RightPanel } from "@/components/layout/RightPanel";
import { FloatingChatsContainer } from "@/components/messaging/FloatingChatsContainer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a]">
      <Sidebar />
      <main className="flex-1">{children}</main>
      <RightPanel />

      <FloatingChatsContainer />
    </div>
  );
}
