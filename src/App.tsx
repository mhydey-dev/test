import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import NotFound from "./pages/NotFound";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/app/Dashboard";
import Templates from "./pages/app/Templates";
import Workflows from "./pages/app/Workflows";
import Wallets from "./pages/app/Wallets";
import Settings from "./pages/app/Settings";
import Builder from "./pages/app/Builder";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* App is now the root */}
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="create" element={<Templates />} />
              <Route path="templates" element={<Templates />} />
              <Route path="workflows" element={<Workflows />} />
              <Route path="wallets" element={<Wallets />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Legacy /app routes still supported */}
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="create" element={<Templates />} />
              <Route path="templates" element={<Templates />} />
              <Route path="workflows" element={<Workflows />} />
              <Route path="wallets" element={<Wallets />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="/builder" element={<Builder />} />
            <Route path="/app/builder" element={<Builder />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
