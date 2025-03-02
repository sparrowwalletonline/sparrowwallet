
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ui/theme-provider";
import { Toaster } from "./components/ui/toaster";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import WalletChoice from "./pages/WalletChoice";
import GenerateWallet from "./pages/GenerateWallet";
import SeedPhrasePage from "./pages/SeedPhrasePage";
import PassPhrase from "./pages/PassPhrase";
import SeedPhraseValidation from "./pages/SeedPhraseValidation";
import CongratsPage from "./pages/CongratsPage";
import WalletView from "./pages/WalletView";
import Terms from "./pages/Terms";
import Auth from "./pages/Auth";
import CryptoDetailView from "./pages/CryptoDetailView";
import { MenuProvider } from "./contexts/MenuContext";
import { WalletProvider } from "./contexts/WalletContext";
import SideMenu from "./components/SideMenu";

import "./App.css";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <MenuProvider>
        <Router>
          <SideMenu />
          <Routes>
            <Route path="/" element={
              <WalletProvider>
                <LandingPage />
              </WalletProvider>
            } />
            <Route path="/auth" element={<Auth />} />
            <Route path="/app" element={<Index />} />
            <Route path="/wallet" element={<WalletView />} />
            <Route path="/wallet/crypto/:symbol" element={<CryptoDetailView />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/wallet-choice" element={
              <WalletProvider>
                <WalletChoice />
              </WalletProvider>
            } />
            <Route path="/generate-wallet" element={<GenerateWallet />} />
            <Route path="/seed-phrase" element={<SeedPhrasePage />} />
            <Route path="/pass-phrase" element={<PassPhrase />} />
            <Route path="/seed-phrase-validation" element={<SeedPhraseValidation />} />
            <Route path="/congrats" element={<CongratsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </MenuProvider>
    </ThemeProvider>
  );
}

export default App;
