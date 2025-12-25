import { RightPanel } from "@/components/layout/RightPanel";
import { Sidebar } from "@/components/layout/Sidebar";
import { FloatingChatsContainer } from "@/components/messaging/FloatingChatsContainer";
import { ReduxProvider } from "@/providers/ReduxProvider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <Sidebar />
          <main className="flex-1">{children}</main>
          <RightPanel />
          <FloatingChatsContainer />
        </div>
      </div>
    </ReduxProvider>
  );
}
