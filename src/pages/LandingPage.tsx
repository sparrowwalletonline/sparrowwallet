
import React from 'react';
import { Button } from '@/components/ui/button';
import WalletLogo from '@/components/WalletLogo';
import { ArrowRight } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';

const LandingPage: React.FC = () => {
  const { generateWallet } = useWallet();

  const handleCreateWallet = () => {
    generateWallet();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-10">
        <WalletLogo className="w-24 h-24 animate-scale-in" />
        
        <div className="space-y-4 text-center max-w-xs">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Trusty Wallet
          </h1>
          <p className="text-muted-foreground">
            The most trusted & secure crypto wallet. Buy, store, exchange & earn crypto.
          </p>
        </div>
        
        <div className="glass-morph rounded-xl p-6 w-full max-w-sm space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-semibold text-white">
              Get Started
            </h2>
            <p className="text-sm text-muted-foreground">
              Create a new wallet in seconds and start your crypto journey
            </p>
          </div>
          
          <Button 
            onClick={handleCreateWallet}
            className="w-full py-6 text-base flex items-center justify-center gap-2"
          >
            Create Wallet <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-center text-xs text-muted-foreground max-w-xs">
          By creating a wallet, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
