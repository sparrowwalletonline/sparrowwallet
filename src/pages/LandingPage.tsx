
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import WalletLogo from '@/components/WalletLogo';
import { useWallet } from '@/contexts/WalletContext';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSeedPhrase } = useWallet();
  
  const handleGetStarted = () => {
    // Navigate to Auth page instead of setting seed phrase directly
    navigate('/auth');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 text-white animate-fade-in">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <WalletLogo size="large" />
          <h1 className="mt-6 text-3xl font-bold text-center font-heading">Cryption Wallet</h1>
          <p className="mt-2 text-xl text-center text-wallet-gray">Sicher. Einfach. Dezentralisiert.</p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="space-y-4 text-center">
            <p className="text-lg">
              Verwalten Sie Ihre Kryptowährungen mit unserer sicheren und benutzerfreundlichen Wallet.
            </p>
          </div>
          
          <Button 
            onClick={handleGetStarted}
            className="w-full py-6 text-lg transition-all font-heading"
          >
            Loslegen
          </Button>
          
          <p className="text-sm text-center text-wallet-gray">
            Durch Klicken auf "Loslegen" stimmen Sie unseren <a href="/terms" className="text-wallet-blue hover:underline">Nutzungsbedingungen</a> zu.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
