
import React from 'react';
import { Card } from "@/components/ui/card";
import { useWallet } from '@/contexts/WalletContext';
import { Bitcoin } from 'lucide-react';

const WalletBalance: React.FC = () => {
  const { btcBalance, btcPrice, usdBalance, walletAddress } = useWallet();
  
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
      <Card className="wallet-card overflow-hidden text-white p-6 relative">
        <div className="flex flex-col h-full">
          <div className="flex items-center mb-1">
            <Bitcoin className="h-6 w-6 mr-2" />
            <h3 className="font-medium">Bitcoin</h3>
          </div>
          
          <div className="my-4">
            <div className="text-3xl font-bold">{btcBalance} BTC</div>
            <div className="text-blue-100 font-medium mt-1">{formatUSD(usdBalance)}</div>
          </div>
          
          <div className="mt-auto pt-2">
            <div className="text-xs text-blue-100 mb-1">Wallet Address</div>
            <div className="text-sm font-medium truncate">{formatAddress(walletAddress)}</div>
          </div>
        </div>

        {/* Abstract background pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="75" cy="25" r="20" fill="white"/>
            <circle cx="40" cy="70" r="35" fill="white"/>
          </svg>
        </div>
      </Card>

      <div className="mt-4 bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="text-sm text-wallet-gray">Bitcoin Price</div>
          <div className="font-medium">{formatUSD(btcPrice)}</div>
        </div>
      </div>
    </div>
  );
};

export default WalletBalance;
