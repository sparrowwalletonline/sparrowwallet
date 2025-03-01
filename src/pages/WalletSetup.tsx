
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';

const WalletSetup: React.FC = () => {
  const { createWallet, cancelWalletCreation } = useWallet();
  
  const handleGoBack = () => {
    cancelWalletCreation();
  };
  
  const handleCreatePassphrase = () => {
    createWallet();
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white p-6">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="p-0 hover:bg-transparent"
          onClick={handleGoBack}
        >
          <ArrowLeft className="h-6 w-6 text-black" />
        </Button>
        <h1 className="text-xl font-medium text-center flex-1 pr-6">Neue Brieftasche</h1>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-between">
        {/* Wallet Icon */}
        <div className="flex-1 flex items-center justify-center w-full">
          <img 
            src="/lovable-uploads/e15c2b86-a781-4f36-9687-346e9de6f148.png" 
            alt="Wallet" 
            className="w-32 h-32"
          />
        </div>
        
        {/* Bottom section */}
        <div className="w-full space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Wir werden Deine eigene Passphrase erstellen</h2>
          <p className="text-gray-700">So können Sie Ihre Brieftasche auf mehreren Geräten öffnen und es bleibt sicher.</p>
          <p className="text-gray-700 mb-10">Es ist sehr wichtig, die Passphrase zu notieren.</p>
          
          <Button 
            onClick={handleCreatePassphrase}
            className="w-full py-6 text-base bg-[#4CAF50] hover:bg-[#45a049] text-white font-medium"
          >
            Passphrase erstellen
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WalletSetup;
