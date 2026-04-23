import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/app/AppSidebar";
import { MobileBottomNav } from "@/components/app/MobileNav";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="hidden md:block">
        <AppSidebar />
      </div>

      <main className="flex-1 flex flex-col overflow-hidden pb-20 md:pb-0">
        <Outlet />
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default AppLayout;
