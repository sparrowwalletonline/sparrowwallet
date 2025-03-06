
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateWalletButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/wallet-choice');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button 
        onClick={handleClick}
        className="rounded-full shadow-lg w-12 h-12 p-0 flex items-center justify-center transition-all hover:scale-105 hover:shadow-xl bg-wallet-blue"
      >
        <Wallet className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default CreateWalletButton;
