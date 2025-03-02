
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
import { WalletProvider, useWallet } from "./contexts/WalletContext";
import SideMenu from "./components/SideMenu";

import "./App.css";

// Authentication guard component
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useWallet();

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
        <WalletProvider>
          <Router>
            <SideMenu />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/app" element={<Index />} />
              <Route path="/wallet" element={
                <PrivateRoute>
                  <WalletView />
                </PrivateRoute>
              } />
              <Route path="/wallet/crypto/:symbol" element={
                <PrivateRoute>
                  <CryptoDetailView />
                </PrivateRoute>
              } />
              <Route path="/terms" element={<Terms />} />
              <Route path="/wallet-choice" element={<WalletChoice />} />
              <Route path="/generate-wallet" element={<GenerateWallet />} />
              <Route path="/seed-phrase" element={<SeedPhrasePage />} />
              <Route path="/pass-phrase" element={<PassPhrase />} />
              <Route path="/seed-phrase-validation" element={<SeedPhraseValidation />} />
              <Route path="/congrats" element={<CongratsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </WalletProvider>
        <Toaster />
      </MenuProvider>
    </ThemeProvider>
  );
}

export default App;
