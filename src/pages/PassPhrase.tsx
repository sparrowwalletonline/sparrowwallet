
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import WalletLogo from '@/components/WalletLogo';

const PassPhrase: React.FC = () => {
  const { createWallet, cancelWalletCreation } = useWallet();
  
  const handleBackClick = () => {
    cancelWalletCreation();
  };
  
  const handleCreatePassphrase = () => {
    createWallet();
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center bg-wallet-darkBg text-white p-6 relative">
      <div className="absolute top-6 left-6">
        <button 
          onClick={handleBackClick}
          className="text-white hover:text-gray-300 transition-colors"
          aria-label="Zurück"
        >
          <ArrowLeft size={24} />
        </button>
      </div>
      
      <div className="w-full text-center mt-6">
        <h1 className="font-heading text-xl font-medium">Neue Wallet</h1>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <WalletLogo className="w-32 h-32 mb-8" color="green" />
      </div>
      
      <div className="w-full max-w-xs text-center mb-6">
        <h2 className="text-2xl font-bold mb-4">
          Wir werden Deine eigene Passphrase erstellen
        </h2>
        <p className="text-wallet-gray mb-4">
          So können Sie Ihre Wallet auf mehreren Geräten öffnen und es bleibt sicher.
        </p>
        <p className="text-wallet-gray mb-8">
          Es ist sehr wichtig, die Passphrase zu notieren.
        </p>
        
        <Button 
          onClick={handleCreatePassphrase}
          className="w-full py-6 bg-wallet-green hover:bg-wallet-green/90 text-black font-medium"
        >
          Passphrase erstellen
        </Button>
      </div>
    </div>
  );
};

export default PassPhrase;
