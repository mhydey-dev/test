import { Outlet, useLocation } from "react-router-dom";
import AppSidebar from "@/components/app/AppSidebar";
import { MobileBottomNav } from "@/components/app/MobileNav";

const AppLayout = () => {
  const location = useLocation();
  const isBuilderPage = location.pathname === "/app/builder";

  return (
    <div className="flex min-h-screen w-full mesh-gradient">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <AppSidebar />
      </div>
      
      <main className={`flex-1 flex flex-col overflow-hidden ${!isBuilderPage ? 'pb-20 md:pb-0' : ''}`}>
        <Outlet />
      </main>
      
      {/* Mobile Bottom Navigation - hidden on desktop and builder */}
      {!isBuilderPage && <MobileBottomNav />}
    </div>
  );
};

export default AppLayout;
