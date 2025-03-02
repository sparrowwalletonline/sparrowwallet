
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const CongratsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleOpenWallet = () => {
    navigate('/wallet');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-wallet-darkBg text-white p-6 animate-fade-in">
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center text-center">
        <CheckCircle className="h-24 w-24 text-wallet-green mb-6" />
        
        <h1 className="text-3xl font-bold mb-2">Herzlichen Glückwunsch!</h1>
        
        <p className="text-lg text-wallet-gray mb-8">
          Deine Wallet wurde erstellt!
        </p>
        
        <Button 
          onClick={handleOpenWallet}
          variant="wallet"
          className="w-full px-6 py-6 text-lg"
        >
          Wallet öffnen!
        </Button>
      </div>
    </div>
  );
};

export default CongratsPage;
