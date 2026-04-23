import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Plus, 
  LayoutTemplate, 
  Wallet, 
  Zap, 
  Settings,
  Menu,
  X,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { title: "Dashboard", url: "/app", icon: LayoutDashboard },
  { title: "Create", url: "/app/builder", icon: Plus },
  { title: "Templates", url: "/app/templates", icon: LayoutTemplate },
  { title: "Wallets", url: "/app/wallets", icon: Wallet },
  { title: "Workflows", url: "/app/workflows", icon: Zap },
  { title: "Settings", url: "/app/settings", icon: Settings },
];

export const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/app") return location.pathname === "/app";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Menu size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center gap-3 p-4 border-b border-border/40">
              <div className="h-9 w-9 rounded-xl bg-primary/15 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <span className="font-display font-bold text-lg text-foreground">
                FlowFi
              </span>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 p-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.url}
                  to={item.url}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                    isActive(item.url)
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  )}
                >
                  <item.icon size={20} />
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

// Bottom navigation for mobile
export const MobileBottomNav = () => {
  const location = useLocation();
  
  const bottomItems = [
    { title: "Dashboard", url: "/app", icon: LayoutDashboard },
    { title: "Templates", url: "/app/templates", icon: LayoutTemplate },
    { title: "Create", url: "/app/builder", icon: Plus, primary: true },
    { title: "Workflows", url: "/app/workflows", icon: Zap },
    { title: "Settings", url: "/app/settings", icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === "/app") return location.pathname === "/app";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border/40 z-50 safe-area-bottom">
      <div className="flex items-center justify-around py-2">
        {bottomItems.map((item) => (
          <Link
            key={item.url}
            to={item.url}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all",
              item.primary 
                ? "bg-primary text-primary-foreground rounded-full p-3 -mt-6 shadow-lg"
                : isActive(item.url)
                  ? "text-primary"
                  : "text-muted-foreground"
            )}
          >
            <item.icon size={item.primary ? 22 : 20} />
            {!item.primary && (
              <span className="text-[10px] font-medium">{item.title}</span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
};
