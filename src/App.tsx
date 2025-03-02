
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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

// Authentication guard component
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  // This will get the session status from the Wallet context
  const { session } = WalletProvider();

  if (!session) {
    // Redirect to auth page if not authenticated
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

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
            <Route path="/wallet" element={
              <WalletProvider>
                <WalletView />
              </WalletProvider>
            } />
            <Route path="/wallet/crypto/:symbol" element={
              <WalletProvider>
                <CryptoDetailView />
              </WalletProvider>
            } />
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
