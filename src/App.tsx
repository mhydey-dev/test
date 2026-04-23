import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import NotFound from "./pages/NotFound";
import AppLayout from "./layouts/AppLayout";
import Overview from "./pages/app/Overview";
import Score from "./pages/app/Score";
import Proofs from "./pages/app/Proofs";
import ProofDetail from "./pages/app/ProofDetail";
import Access from "./pages/app/Access";
import Ask from "./pages/app/Ask";
import Developers from "./pages/app/Developers";
import Settings from "./pages/app/Settings";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Overview />} />
              <Route path="score" element={<Score />} />
              <Route path="proofs" element={<Proofs />} />
              <Route path="proofs/:id" element={<ProofDetail />} />
              <Route path="access" element={<Access />} />
              <Route path="ask" element={<Ask />} />
              <Route path="developers" element={<Developers />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
