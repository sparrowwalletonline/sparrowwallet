
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
        size="lg" 
        className="rounded-full shadow-lg px-5 py-6 font-medium text-sm transition-all hover:scale-105 hover:shadow-xl bg-wallet-blue"
      >
        <Wallet className="mr-2 h-4 w-4" />
        Create Wallet Now
      </Button>
    </div>
  );
};

export default CreateWalletButton;
