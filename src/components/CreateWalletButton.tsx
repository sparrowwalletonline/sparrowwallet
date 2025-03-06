
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
        className="rounded-md shadow-lg px-3 py-1 text-xs flex items-center justify-center gap-1 transition-all hover:scale-105 hover:shadow-xl bg-wallet-blue"
      >
        <Wallet className="h-3 w-3" />
        <span>Create Wallet</span>
      </Button>
    </div>
  );
};

export default CreateWalletButton;
