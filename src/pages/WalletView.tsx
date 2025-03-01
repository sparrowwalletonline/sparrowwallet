
import React from 'react';
import Header from '@/components/Header';
import WalletBalance from '@/components/WalletBalance';
import WalletActions from '@/components/WalletActions';

const WalletView: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col px-4">
      <Header title="Wallet" />
      
      <div className="flex-1 flex flex-col gap-6 py-4">
        <WalletBalance />
        <WalletActions />
      </div>
    </div>
  );
};

export default WalletView;
