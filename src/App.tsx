
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/ui/theme-provider";
import { Toaster } from "./components/ui/toaster";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import WalletChoice from "./pages/WalletChoice";
import WalletIntroPage from "./pages/WalletIntroPage";
import GenerateWallet from "./pages/GenerateWallet";
import SeedPhrasePage from "./pages/SeedPhrasePage";
import PassPhrase from "./pages/PassPhrase";
import SeedPhraseValidation from "./pages/SeedPhraseValidation";
import CongratsPage from "./pages/CongratsPage";
import WalletView from "./pages/WalletView";
import BrowserView from "./pages/BrowserView";
import Terms from "./pages/Terms";
import Auth from "./pages/Auth";
import Register from "./pages/Register";
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
import PageTransition from "./components/PageTransition";

import "./App.css";

// Authentication guard component - modified to check for hasWallet
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, requirePinVerification, pinVerified, hasWallet } = useWallet();

  // First check if user has a session (logged in)
  if (!session) {
    // Redirect to auth page if no session
    return <Navigate to="/auth" replace />;
  }
  
  // Then check if user has a wallet
  if (!hasWallet) {
    // Redirect to wallet choice if logged in but no wallet
    return <Navigate to="/app" replace />;
  }

  // Finally check if PIN verification is required
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
                <Route path="/" element={
                  <PageTransition>
                    <LandingPage />
                  </PageTransition>
                } />
                <Route path="/auth" element={
                  <PageTransition>
                    <Auth />
                  </PageTransition>
                } />
                <Route path="/register" element={
                  <PageTransition>
                    <Register />
                  </PageTransition>
                } />
                <Route path="/app" element={
                  <PageTransition>
                    <WalletChoice />
                  </PageTransition>
                } />
                <Route path="/wallet-intro" element={
                  <PageTransition>
                    <WalletIntroPage />
                  </PageTransition>
                } />
                <Route path="/personal-data" element={
                  <PageTransition>
                    <PersonalDataForm onComplete={() => {}} />
                  </PageTransition>
                } />
                <Route path="/wallet" element={
                  <PageTransition>
                    <PrivateRoute>
                      <WalletView />
                    </PrivateRoute>
                  </PageTransition>
                } />
                <Route path="/wallet/crypto/:symbol" element={
                  <PageTransition>
                    <PrivateRoute>
                      <CryptoDetailView />
                    </PrivateRoute>
                  </PageTransition>
                } />
                <Route path="/browser" element={
                  <PageTransition>
                    <PrivateRoute>
                      <BrowserView />
                    </PrivateRoute>
                  </PageTransition>
                } />
                <Route path="/terms" element={
                  <PageTransition>
                    <Terms />
                  </PageTransition>
                } />
                <Route path="/generate-wallet" element={
                  <PageTransition>
                    <GenerateWallet />
                  </PageTransition>
                } />
                <Route path="/seed-phrase" element={
                  <PageTransition>
                    <SeedPhrasePage />
                  </PageTransition>
                } />
                <Route path="/passphrase" element={
                  <PageTransition>
                    <PassPhrase />
                  </PageTransition>
                } />
                <Route path="/seed-phrase-validation" element={
                  <PageTransition>
                    <SeedPhraseValidation />
                  </PageTransition>
                } />
                <Route path="/congrats" element={
                  <PageTransition>
                    <CongratsPage />
                  </PageTransition>
                } />
                <Route path="/security-settings" element={
                  <PageTransition>
                    <PrivateRoute>
                      <SecuritySettings />
                    </PrivateRoute>
                  </PageTransition>
                } />
                <Route path="/profile-settings" element={
                  <PageTransition>
                    <PrivateRoute>
                      <ProfileSettings />
                    </PrivateRoute>
                  </PageTransition>
                } />
                <Route path="/payment-methods" element={
                  <PageTransition>
                    <PrivateRoute>
                      <PaymentMethods />
                    </PrivateRoute>
                  </PageTransition>
                } />
                <Route path="/app-settings" element={
                  <PageTransition>
                    <PrivateRoute>
                      <AppSettings />
                    </PrivateRoute>
                  </PageTransition>
                } />
                <Route path="/help-center" element={
                  <PageTransition>
                    <PrivateRoute>
                      <HelpCenter />
                    </PrivateRoute>
                  </PageTransition>
                } />
                <Route path="/about" element={
                  <PageTransition>
                    <About />
                  </PageTransition>
                } />
                <Route path="/features" element={
                  <PageTransition>
                    <Features />
                  </PageTransition>
                } />
                <Route path="/documentation" element={
                  <PageTransition>
                    <Documentation />
                  </PageTransition>
                } />
                <Route path="/support" element={
                  <PageTransition>
                    <Support />
                  </PageTransition>
                } />
                <Route path="/donate" element={
                  <PageTransition>
                    <Donate />
                  </PageTransition>
                } />
                <Route path="*" element={
                  <PageTransition>
                    <NotFound />
                  </PageTransition>
                } />
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
