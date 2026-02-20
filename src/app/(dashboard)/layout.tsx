import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { BottomNav } from "@/components/layout/bottom-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <Topbar />
      <BottomNav />
      <main className="md:ml-[240px] lg:ml-[240px] md:max-lg:ml-[72px] min-h-screen pt-14 md:pt-0 pb-20 md:pb-0">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8 py-6 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
