
import React from 'react';
import { Button } from '@/components/ui/button';
import SeedPhraseGenerator from '@/components/SeedPhraseGenerator';
import WalletLogo from '@/components/WalletLogo';
import { useWallet } from '@/contexts/WalletContext';
import { Shield, X } from 'lucide-react';

const GenerateWallet: React.FC = () => {
  const { seedPhrase, createWallet, cancelWalletCreation } = useWallet();
  
  const handleCreateWallet = () => {
    createWallet();
  };

  const handleCancel = () => {
    cancelWalletCreation();
  };

  return (
    <div className="min-h-screen flex flex-col px-4">
      <div className="flex-1 flex flex-col items-center justify-center gap-8 py-8">
        <WalletLogo className="animate-scale-in" />
        
        <div className="w-full max-w-md">
          <SeedPhraseGenerator />
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 max-w-md w-full">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-wallet-blue mt-0.5" />
            <div>
              <h3 className="font-medium text-sm mb-1">Keep your phrase safe</h3>
              <p className="text-xs text-wallet-gray">
                Your seed phrase is the only way to recover your wallet if you lose access. 
                Write it down and store it in a secure location.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex w-full max-w-md gap-4">
          <Button 
            onClick={handleCancel}
            className="flex-1 h-12 bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-sm"
            variant="outline"
          >
            <X size={18} className="mr-2" /> Cancel
          </Button>
          
          <Button 
            onClick={handleCreateWallet}
            className="flex-1 h-12 bg-wallet-blue hover:bg-wallet-darkBlue shadow-sm"
            disabled={seedPhrase.length === 0}
          >
            Create Wallet
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GenerateWallet;
