
import React from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Bitcoin } from 'lucide-react';

const WalletBalance: React.FC = () => {
  const { btcBalance, btcPrice, ethBalance, ethPrice, usdBalance, walletAddress } = useWallet();
  
  // Format address to be shorter for display
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  // Format USD amount with commas
  const formatUSD = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="animate-fade-in w-full">
      <div className="mb-1 px-1">
        <h2 className="text-3xl font-bold">{formatUSD(usdBalance)}</h2>
      </div>
      
      <div className="flex justify-between mt-6">
        <CryptoAction icon="send" label="Send" />
        <CryptoAction icon="receive" label="Receive" />
        <CryptoAction icon="buy" label="Buy" />
        <CryptoAction icon="earn" label="Earn" />
      </div>
      
      {/* Promotion Card */}
      <div className="mt-4 bg-[#232733] rounded-xl p-4 border border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <img 
              src="/lovable-uploads/b5f7d5f1-4b8c-465c-ab6e-151090ca29ec.png" 
              alt="Promotion" 
              className="w-10 h-10 object-cover rounded-lg"
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium">Add funds from exchange</p>
              <button className="text-xs text-gray-400">×</button>
            </div>
            <p className="text-xs text-wallet-green mt-1">Deposit now →</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CryptoAction = ({ icon, label }: { icon: string, label: string }) => {
  const getIcon = () => {
    switch(icon) {
      case 'send':
        return (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4V20M12 4L6 10M12 4L18 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'receive':
        return (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 20V4M12 20L6 14M12 20L18 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'buy':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'earn':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return <Bitcoin className="h-5 w-5" />;
    }
  };

  return (
    <button className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full bg-wallet-card flex items-center justify-center mb-1">
        {getIcon()}
      </div>
      <span className="text-xs">{label}</span>
    </button>
  );
};

export default WalletBalance;
