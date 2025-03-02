import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';

const PassPhrase: React.FC = () => {
  const { createWallet, cancelWalletCreation } = useWallet();
  const navigate = useNavigate();
  
  const handleBackClick = () => {
    cancelWalletCreation();
    navigate('/wallet-choice');
  };
  
  const handleCreatePassphrase = () => {
    // Call createWallet to generate a seed phrase, but navigate directly
    // without relying on state change to trigger navigation
    createWallet();
    navigate('/seed-phrase');
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center bg-wallet-darkBg text-white p-6 relative">
      <div className="w-full relative">
        <Header title="Neue Wallet" />
        <button 
          onClick={handleBackClick}
          className="absolute left-4 top-0 bottom-0 my-auto text-white hover:text-gray-300 transition-colors h-9 w-9 flex items-center justify-center"
          aria-label="Zurück"
        >
          <ArrowLeft size={24} />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <img 
          src="/lovable-uploads/592e4215-1f4a-4c0d-a1e9-504a24191442.png" 
          alt="Wallet Logo" 
          className="w-32 h-32 mb-8"
        />
      </div>
      
      <div className="w-full max-w-xs text-left mb-6">
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
          className="w-full py-6 bg-wallet-blue hover:bg-wallet-darkBlue text-white font-medium"
        >
          Passphrase erstellen
        </Button>
      </div>
    </div>
  );
};

export default PassPhrase;
