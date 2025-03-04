
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
import BrowserView from "./pages/BrowserView";
import Terms from "./pages/Terms";
import Auth from "./pages/Auth";
import CryptoDetailView from "./pages/CryptoDetailView";
import { MenuProvider } from "./contexts/MenuContext";
import { WalletProvider, useWallet } from "./contexts/WalletContext";
import { TutorialProvider } from "./contexts/TutorialContext";
import TutorialPopover from "./components/TutorialPopover";
import TutorialOverlay from "./components/TutorialOverlay";
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
  // Get the user's preferred color scheme
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const defaultTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');

  return (
    <ThemeProvider defaultTheme={defaultTheme} storageKey="wallet-theme" attribute="class">
      <MenuProvider>
        <WalletProvider>
          <Router>
            <TutorialProvider>
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
                <Route path="/browser" element={
                  <PrivateRoute>
                    <BrowserView />
                  </PrivateRoute>
                } />
                <Route path="/terms" element={<Terms />} />
                <Route path="/wallet-choice" element={
                  <PrivateRoute>
                    <WalletChoice />
                  </PrivateRoute>
                } />
                <Route path="/generate-wallet" element={
                  <PrivateRoute>
                    <GenerateWallet />
                  </PrivateRoute>
                } />
                <Route path="/seed-phrase" element={
                  <PrivateRoute>
                    <SeedPhrasePage />
                  </PrivateRoute>
                } />
                <Route path="/passphrase" element={
                  <PrivateRoute>
                    <PassPhrase />
                  </PrivateRoute>
                } />
                <Route path="/seed-phrase-validation" element={
                  <PrivateRoute>
                    <SeedPhraseValidation />
                  </PrivateRoute>
                } />
                <Route path="/congrats" element={
                  <PrivateRoute>
                    <CongratsPage />
                  </PrivateRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <TutorialPopover />
              <TutorialOverlay />
            </TutorialProvider>
          </Router>
          <Toaster />
        </WalletProvider>
      </MenuProvider>
    </ThemeProvider>
  );
}

export default App;
