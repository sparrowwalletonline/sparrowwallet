
import React from 'react';
import { WalletProvider } from '@/contexts/WalletContext';
import LandingPage from './LandingPage';
import Header from '@/components/Header';

// Main component with provider
const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-wallet-darkBg flex flex-col w-full">
      <WalletProvider>
        <Header title="Cryption Wallet" />
        <div className="flex-1">
          <LandingPage />
        </div>
      </WalletProvider>
    </div>
  );
};

export default Index;
