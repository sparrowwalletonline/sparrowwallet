
import React, { useEffect } from 'react';
import { WalletProvider, useWallet } from '@/contexts/WalletContext';
import LandingPage from './LandingPage';
import GenerateWallet from './GenerateWallet';
import WalletView from './WalletView';

// Wrapper component to handle view switching
const WalletApp: React.FC = () => {
  const { hasWallet, seedPhrase } = useWallet();

  // Determine which view to show
  const showLandingPage = seedPhrase.length === 0;
  const showGenerateWallet = !hasWallet && seedPhrase.length > 0;
  
  return (
    <div className="slide-transition w-full max-w-md mx-auto min-h-screen shadow-lg bg-wallet-darkBg">
      {showLandingPage && <LandingPage />}
      {showGenerateWallet && <GenerateWallet />}
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
