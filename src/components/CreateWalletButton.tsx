
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import TermsAgreementDialog from './TermsAgreementDialog';

const CreateWalletButton = () => {
  const navigate = useNavigate();
  const [showTermsDialog, setShowTermsDialog] = useState(false);

  const handleClick = () => {
    setShowTermsDialog(true);
  };

  const handleTermsAccepted = () => {
    setShowTermsDialog(false);
    navigate('/passphrase');
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          onClick={handleClick}
          size="sm"
          className={cn(
            "rounded-md shadow-lg flex items-center justify-center gap-1",
            "transition-all hover:scale-105 hover:shadow-xl bg-wallet-blue"
          )}
        >
          <Wallet className="h-3 w-3" />
          <span className="text-xs">Create Wallet</span>
        </Button>
      </div>
      
      <TermsAgreementDialog 
        isOpen={showTermsDialog} 
        onClose={() => setShowTermsDialog(false)} 
        onAccept={handleTermsAccepted} 
      />
    </>
  );
};

export default CreateWalletButton;
