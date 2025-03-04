
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
    // Add exit animation
    document.body.classList.add('page-exit');
    
    setTimeout(() => {
      cancelWalletCreation();
      navigate('/wallet-choice');
      // Remove class after navigation
      setTimeout(() => {
        document.body.classList.remove('page-exit');
      }, 50);
    }, 300);
  };
  
  const handleCreatePassphrase = () => {
    // Add exit animation
    document.body.classList.add('page-exit');
    
    setTimeout(() => {
      // Call createWallet to generate a seed phrase, but navigate directly
      // without relying on state change to trigger navigation
      createWallet();
      navigate('/seed-phrase');
      // Remove class after navigation
      setTimeout(() => {
        document.body.classList.remove('page-exit');
      }, 50);
    }, 300);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center bg-wallet-darkBg text-white p-4 sm:p-6 relative page-enter">
      <div className="w-full relative">
        <Header title="Neue Wallet" />
        <button 
          onClick={handleBackClick}
          className="absolute left-2 sm:left-4 top-0 bottom-0 my-auto text-white hover:text-gray-300 transition-colors h-9 w-9 flex items-center justify-center"
          aria-label="Zurück"
        >
          <ArrowLeft size={24} />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <img 
          src="/lovable-uploads/592e4215-1f4a-4c0d-a1e9-504a24191442.png" 
          alt="Wallet Logo" 
          className="w-24 h-24 sm:w-32 sm:h-32 mb-6 sm:mb-8"
        />
      </div>
      
      <div className="w-full max-w-xs text-left mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
          Wir werden Deine eigene Passphrase erstellen
        </h2>
        <p className="text-wallet-gray text-sm mb-3 sm:mb-4">
          So können Sie Ihre Wallet auf mehreren Geräten öffnen und es bleibt sicher.
        </p>
        <p className="text-wallet-gray text-sm mb-6 sm:mb-8">
          Es ist sehr wichtig, die Passphrase zu notieren.
        </p>
        
        <Button 
          onClick={handleCreatePassphrase}
          className="w-full py-4 sm:py-6 bg-wallet-blue hover:bg-wallet-darkBlue text-white text-sm sm:text-base font-medium"
        >
          Passphrase erstellen
        </Button>
      </div>
    </div>
  );
};

export default PassPhrase;
