
import React, { useEffect } from 'react';
import { WalletProvider, useWallet } from '@/contexts/WalletContext';
import GenerateWallet from './GenerateWallet';
import WalletView from './WalletView';

// Wrapper component to handle view switching
const WalletApp: React.FC = () => {
  const { hasWallet, generateWallet } = useWallet();

  // Generate seed phrase on first load
  useEffect(() => {
    if (!hasWallet) {
      generateWallet();
    }
  }, [generateWallet, hasWallet]);

  return (
    <div className="slide-transition max-w-md mx-auto bg-white min-h-screen shadow-lg">
      {hasWallet ? <WalletView /> : <GenerateWallet />}
    </div>
  );
};

// Main component with provider
const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <WalletProvider>
        <WalletApp />
      </WalletProvider>
    </div>
  );
};

export default Index;
