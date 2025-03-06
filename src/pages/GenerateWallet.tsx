
import React from 'react';
import { Button } from '@/components/ui/button';
import SeedPhraseGenerator from '@/components/SeedPhraseGenerator';
import WalletLogo from '@/components/WalletLogo';
import { useWallet } from '@/contexts/WalletContext';
import { Shield, X, Check, LockKeyhole } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';

const GenerateWallet: React.FC = () => {
  const { seedPhrase, createWallet, cancelWalletCreation } = useWallet();
  const navigate = useNavigate();
  
  const handleCreateWallet = () => {
    // Add exit animation
    document.body.classList.add('page-exit');
    
    setTimeout(() => {
      createWallet();
      
      // Remove class after navigation
      setTimeout(() => {
        document.body.classList.remove('page-exit');
      }, 50);
    }, 300);
  };

  const handleCancel = () => {
    // Add exit animation
    document.body.classList.add('page-exit');
    
    setTimeout(() => {
      cancelWalletCreation();
      navigate('/app');
      
      // Remove class after navigation
      setTimeout(() => {
        document.body.classList.remove('page-exit');
      }, 50);
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col px-4 page-enter safe-area-inset-bottom bg-gradient-to-b from-white to-blue-50">
      <div className="flex-1 flex flex-col items-center justify-center gap-5 sm:gap-8 py-6 sm:py-8">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-200 rounded-full blur-xl opacity-40 animate-pulse"></div>
          <WalletLogo 
            className="animate-scale-in w-20 h-20 sm:w-24 sm:h-24 relative z-10" 
            useSparrowLogo={true}
          />
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 font-heading animate-fade-in">
          Create Your Wallet
        </h1>
        
        <Card className="w-full max-w-md shadow-lg border border-blue-100 p-6 bg-white rounded-2xl animate-fade-in">
          <SeedPhraseGenerator />
        </Card>
        
        <div className="bg-blue-50 rounded-lg p-4 sm:p-5 border border-blue-100 max-w-md w-full shadow-sm animate-fade-in">
          <div className="flex items-start gap-3 sm:gap-4">
            <LockKeyhole className="h-5 w-5 sm:h-6 sm:w-6 text-wallet-blue mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-sm sm:text-base mb-1 text-gray-800">Keep your phrase secure</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Your seed phrase is the only way to recover your wallet if you lose access. 
                Write it down and store it in a secure location.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex w-full max-w-md gap-3 sm:gap-4 animate-fade-in">
          <Button 
            onClick={handleCancel}
            className="flex-1 h-11 sm:h-12 bg-white hover:bg-gray-50 text-gray-700 shadow-sm border border-gray-200 text-sm sm:text-base min-h-[44px] touch-manipulation"
            variant="outline"
          >
            <X size={18} className="mr-1.5 sm:mr-2" /> Cancel
          </Button>
          
          <Button 
            onClick={handleCreateWallet}
            className="flex-1 h-11 sm:h-12 bg-wallet-blue hover:bg-wallet-darkBlue text-white shadow-md hover:shadow-lg text-sm sm:text-base min-h-[44px] touch-manipulation"
            disabled={seedPhrase.length === 0}
          >
            <Check size={18} className="mr-1.5 sm:mr-2" /> Create Wallet
          </Button>
        </div>
      </div>
      
      <div className="flex justify-center pb-6">
        <p className="text-xs text-gray-500">Step 2 of 4: Generate Seed Phrase</p>
      </div>
    </div>
  );
};

export default GenerateWallet;
