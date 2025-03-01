
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
import SeedPhraseValidation from "./pages/SeedPhraseValidation";
import Terms from "./pages/Terms";
import PassPhrase from "./pages/PassPhrase";
import WalletChoice from "./pages/WalletChoice";

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
            <Route path="/wallet-choice" element={<WalletChoice />} />
            <Route path="/passphrase" element={<PassPhrase />} />
            <Route path="/seed-phrase" element={<SeedPhrasePage />} />
            <Route path="/seed-phrase-validation" element={<SeedPhraseValidation />} />
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
