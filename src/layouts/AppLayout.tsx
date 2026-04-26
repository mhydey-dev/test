import { useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AppSidebar from "@/components/app/AppSidebar";
import AppHeader from "@/components/app/AppHeader";
import { MobileBottomNav } from "@/components/app/MobileNav";
import { zkProofGroups } from "@/lib/reputation-mock";

const getHeaderMeta = (pathname: string) => {
  if (pathname === "/") {
    return {
      title: "Overview",
      subtitle: "Your AI on-chain identity at a glance",
    };
  }
  if (pathname === "/score") {
    return {
      title: "Credit Score",
      subtitle: "Full breakdown of your on-chain reputation",
    };
  }
  if (pathname === "/proofs") {
    return {
      title: "Proofs",
      subtitle: "Prove what you need to - reveal nothing else",
    };
  }
  if (pathname.startsWith("/proofs/")) {
    const id = pathname.split("/")[2];
    const group = zkProofGroups.find((g) => g.id === id);
    if (!group) {
      return { title: "Proof group not found" };
    }
    return {
      title: group.title,
      subtitle:
        "Each level proves a stronger claim - generating one deactivates the lower ones",
    };
  }
  if (pathname === "/access") {
    return {
      title: "Earnings",
      subtitle: "Control what dApps see - and earn from every query",
    };
  }
  if (pathname === "/notifications") {
    return {
      title: "Notifications",
      subtitle: "Alerts, proof requests, and account activity",
    };
  }
  if (pathname === "/persona") {
    return {
      title: "Persona",
      subtitle: "Turn raw on-chain activity into actionable insights",
    };
  }
  if (pathname === "/persona/mint") {
    return {
      title: "Mint Persona NFT",
      subtitle: "Mint your identity to unlock Persona",
    };
  }
  if (pathname === "/settings") {
    return {
      title: "Settings",
      subtitle: "Identity sources, privacy, and notifications",
    };
  }
  return { title: "Databook" };
};

const AppLayout = () => {
  const location = useLocation();
  const header = useMemo(
    () => getHeaderMeta(location.pathname),
    [location.pathname],
  );

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sticky sidebar — does not scroll with body */}
      <div className="hidden md:block sticky top-0 h-screen shrink-0 self-start">
        <AppSidebar />
      </div>

      <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        <AppHeader title={header.title} subtitle={header.subtitle} />
        <div className="w-full max-w-[1080px] mx-auto flex-1">
          <Outlet />
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default AppLayout;
