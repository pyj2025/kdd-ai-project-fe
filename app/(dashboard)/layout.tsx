import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Navbar from "@/components/shared/Navbar";
import AppSidebar from "@/components/dashboard/AppSidebar";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 고정 Navbar */}
      <Navbar />

      <SidebarProvider className="flex-1 overflow-hidden">
        {/* 고정 Sidebar */}
        <AppSidebar />

        {/* 이 부분만 스크롤 */}
        <SidebarInset className="bg-white h-[calc(100svh-56px)] overflow-y-auto">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default DashboardLayout;
