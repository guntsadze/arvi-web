import { RightPanel } from "@/components/layout/RightPanel";
import { Sidebar } from "@/components/layout/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <main className="flex-1">{children}</main>
        <RightPanel />
      </div>
    </div>
  );
}
