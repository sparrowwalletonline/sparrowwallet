
import React from 'react';
import { Button } from '@/components/ui/button';
import WalletLogo from '@/components/WalletLogo';
import { useWallet } from '@/contexts/WalletContext';

const WalletChoice: React.FC = () => {
  const { generateWallet, importWallet } = useWallet();
  
  const handleCreateWallet = () => {
    generateWallet();
  };
  
  const handleImportWallet = () => {
    // For now, we'll just show import UI by setting a dummy phrase
    // The actual import functionality would be implemented later
    importWallet("dummy phrase to trigger import UI");
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-wallet-darkBg text-white p-6">
      <div className="flex-1"></div>
      
      <div className="flex flex-col items-center justify-center gap-6 w-full max-w-md">
        <WalletLogo className="w-24 h-24 mb-4" />
        <h1 className="font-heading text-3xl font-bold text-center">Trust Wallet</h1>
      </div>
      
      <div className="flex flex-col w-full max-w-md gap-4 mt-auto mb-10">
        <Button 
          onClick={handleCreateWallet}
          className="w-full py-6 text-base bg-green-500 hover:bg-green-600 text-white"
        >
          Neue Wallet erstellen
        </Button>
        
        <Button 
          onClick={handleImportWallet}
          variant="outline" 
          className="w-full py-6 text-base border-gray-600 text-white hover:bg-gray-800"
        >
          Bestehende Brieftasche öffnen
        </Button>
      </div>
      
      <div className="text-center text-xs text-gray-500 mt-4">
        © 2023 Trust Wallet
      </div>
    </div>
  );
};

export default WalletChoice;
