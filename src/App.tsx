
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MenuProvider } from "@/contexts/MenuContext";
import MobileSidebar from "@/components/MobileSidebar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SeedPhrasePage from "./pages/SeedPhrasePage";
import Terms from "./pages/Terms";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MenuProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <MobileSidebar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/seed-phrase" element={<SeedPhrasePage />} />
            <Route path="/terms" element={<Terms />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </MenuProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
