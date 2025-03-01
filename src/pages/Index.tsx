
import React, { useState, useEffect } from 'react';
import { WalletProvider, useWallet } from '@/contexts/WalletContext';
import LandingPage from './LandingPage';
import GenerateWallet from './GenerateWallet';
import WalletView from './WalletView';
import WalletChoice from './WalletChoice';

// Wrapper component to handle view switching
const WalletApp: React.FC = () => {
  const { hasWallet, seedPhrase } = useWallet();
  const [currentView, setCurrentView] = useState<string>('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Determine which view to show
  const showLandingPage = seedPhrase.length === 0;
  const showWalletChoice = seedPhrase.length === 1; // Special case for our flow
  const showCreateWallet = !hasWallet && seedPhrase.length > 1;
  
  useEffect(() => {
    // Determine the current view based on state
    let newView = '';
    if (showLandingPage) newView = 'landing';
    else if (showWalletChoice) newView = 'choice';
    else if (showCreateWallet) newView = 'create';
    else if (hasWallet) newView = 'wallet';

    // Only trigger transition if view actually changes
    if (newView !== currentView && currentView !== '') {
      setIsTransitioning(true);
      
      // After a short delay, update to the new view
      const timer = setTimeout(() => {
        setCurrentView(newView);
        setIsTransitioning(false);
      }, 500); // Increased from 300ms to 500ms for more noticeable transition
      
      return () => clearTimeout(timer);
    } else {
      setCurrentView(newView);
    }
  }, [showLandingPage, showWalletChoice, showCreateWallet, hasWallet, currentView]);
  
  const getTransitionClasses = () => {
    let baseClasses = "w-full max-w-md mx-auto min-h-screen shadow-lg bg-wallet-darkBg overflow-hidden";
    
    if (isTransitioning) {
      return `${baseClasses} slide-transition slide-transition-exit`;
    }
    
    return `${baseClasses} slide-transition slide-transition-enter`;
  };

  return (
    <div className={getTransitionClasses()}>
      {showLandingPage && <LandingPage />}
      {showWalletChoice && <WalletChoice />}
      {showCreateWallet && <GenerateWallet />}
      {hasWallet && <WalletView />}
    </div>
  );
};

// Main component with provider
const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-wallet-darkBg flex justify-center w-full">
      <WalletProvider>
        <WalletApp />
      </WalletProvider>
    </div>
  );
};

export default Index;
