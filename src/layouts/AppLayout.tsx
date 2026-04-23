import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/app/AppSidebar";
import { MobileBottomNav } from "@/components/app/MobileNav";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sticky sidebar — does not scroll with body */}
      <div className="hidden md:block sticky top-0 h-screen shrink-0 self-start">
        <AppSidebar />
      </div>

      <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        <Outlet />
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default AppLayout;
