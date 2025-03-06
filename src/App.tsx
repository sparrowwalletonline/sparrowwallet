
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
import SecuritySettings from "./pages/SecuritySettings";
import ProfileSettings from "./pages/ProfileSettings";
import PaymentMethods from "./pages/PaymentMethods";
import AppSettings from "./pages/AppSettings";
import HelpCenter from "./pages/HelpCenter";
import About from "./pages/About";
import Features from "./pages/Features";
import Documentation from "./pages/Documentation";
import Support from "./pages/Support";
import Donate from "./pages/Donate";
import PinVerification from "./components/PinVerification";
import { MenuProvider } from "./contexts/MenuContext";
import { WalletProvider, useWallet } from "./contexts/WalletContext";
import { TutorialProvider } from "./contexts/TutorialContext";
import TutorialPopover from "./components/TutorialPopover";
import TutorialOverlay from "./components/TutorialOverlay";
import SideMenu from "./components/SideMenu";
import PersonalDataForm from "./components/PersonalDataForm";

import "./App.css";

// Authentication guard component - modified to redirect to wallet choice
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, requirePinVerification, pinVerified } = useWallet();

  if (!session) {
    // Redirect to wallet choice instead of auth
    return <Navigate to="/app" replace />;
  }

  if (requirePinVerification && !pinVerified) {
    return <PinVerification onSuccess={() => {}} />;
  }

  return <>{children}</>;
};

function App() {
  // Force light theme - never allow it to be changed
  const forceLightTheme = 'light';
  
  return (
    <ThemeProvider defaultTheme={forceLightTheme} forcedTheme={forceLightTheme} storageKey="wallet-theme" attribute="class">
      <MenuProvider>
        <WalletProvider>
          <Router>
            <TutorialProvider>
              <SideMenu />
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/app" element={<WalletChoice />} />
                <Route path="/personal-data" element={<PersonalDataForm onComplete={() => {}} />} />
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
                <Route path="/generate-wallet" element={<GenerateWallet />} />
                <Route path="/seed-phrase" element={<SeedPhrasePage />} />
                <Route path="/passphrase" element={<PassPhrase />} />
                <Route path="/seed-phrase-validation" element={<SeedPhraseValidation />} />
                <Route path="/congrats" element={<CongratsPage />} />
                <Route path="/security-settings" element={
                  <PrivateRoute>
                    <SecuritySettings />
                  </PrivateRoute>
                } />
                <Route path="/profile-settings" element={
                  <PrivateRoute>
                    <ProfileSettings />
                  </PrivateRoute>
                } />
                <Route path="/payment-methods" element={
                  <PrivateRoute>
                    <PaymentMethods />
                  </PrivateRoute>
                } />
                <Route path="/app-settings" element={
                  <PrivateRoute>
                    <AppSettings />
                  </PrivateRoute>
                } />
                <Route path="/help-center" element={
                  <PrivateRoute>
                    <HelpCenter />
                  </PrivateRoute>
                } />
                <Route path="/about" element={<About />} />
                <Route path="/features" element={<Features />} />
                <Route path="/documentation" element={<Documentation />} />
                <Route path="/support" element={<Support />} />
                <Route path="/donate" element={<Donate />} />
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
