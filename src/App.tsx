import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { DAppKitProvider } from "@mysten/dapp-kit-react";
import NotFound from "./pages/NotFound";
import AppLayout from "./layouts/AppLayout";
import Overview from "./pages/app/Overview";
import Score from "./pages/app/Score";
import Proofs from "./pages/app/Proofs";
import ProofGroupDetail from "./pages/app/ProofGroupDetail";
import Access from "./pages/app/Access";
import Persona from "./pages/app/Persona";
import Settings from "./pages/app/Settings";
import PersonaMint from "./pages/app/PersonaMint";
import Notifications from "./pages/app/Notifications";
import { dAppKit } from "./dapp-kit";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <QueryClientProvider client={queryClient}>
      <DAppKitProvider dAppKit={dAppKit}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Overview />} />
                <Route path="score" element={<Score />} />
                <Route path="proofs" element={<Proofs />} />
                <Route path="proofs/:id" element={<ProofGroupDetail />} />
                <Route path="access" element={<Access />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="persona" element={<Persona />} />
                <Route path="persona/mint" element={<PersonaMint />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DAppKitProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
