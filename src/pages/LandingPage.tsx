
import React from 'react';
import { Button } from '@/components/ui/button';
import WalletLogo from '@/components/WalletLogo';
import { ArrowRight, Check, Menu } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';

const LandingPage: React.FC = () => {
  const {
    generateWallet
  } = useWallet();
  
  const handleCreateWallet = () => {
    generateWallet();
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      <header className="w-full p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <WalletLogo className="w-8 h-8" />
          <span className="font-heading text-xl font-bold">Trust Wallet</span>
        </div>
        <Menu className="w-6 h-6 cursor-pointer text-gray-800" />
      </header>
      
      <div className="flex-1 flex flex-col p-6">
        <div className="space-y-6 mb-10">
          <h1 className="font-heading tracking-tight text-gray-900 leading-[1.2] font-bold text-4xl md:text-5xl">
            The most trusted<br />
            & secure<br />
            crypto wallet
          </h1>
          
          <p className="font-sans text-gray-600 text-base max-w-md">
            Buy, store, collect NFTs, exchange & earn crypto. Join 50 million+ people using Trust Wallet.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleCreateWallet} className="w-full sm:w-auto py-6 text-base flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all rounded-xl">
              Create a new wallet <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-col space-y-3 pt-4">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-green-100 p-1">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">Multi-chain support for 8M+ assets</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-green-100 p-1">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">Buy crypto with credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-green-100 p-1">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">Self-custodial & secure</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 relative">
          <img alt="Trusty Wallet Features" className="w-full max-w-md mx-auto" src="/lovable-uploads/057ecf4e-ca5a-4928-9979-cb5032455af3.jpg" />
        </div>
        
        <div className="mt-12 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-blue-500 font-heading font-bold text-xl">50M+</div>
            <div className="text-gray-600 text-sm">Users</div>
          </div>
          <div className="text-center">
            <div className="text-blue-500 font-heading font-bold text-xl">100+</div>
            <div className="text-gray-600 text-sm">Blockchains</div>
          </div>
          <div className="text-center">
            <div className="text-blue-500 font-heading font-bold text-xl">8M+</div>
            <div className="text-gray-600 text-sm">Assets</div>
          </div>
        </div>
        
        <div className="text-center text-xs text-gray-500 mt-auto pt-10">
          By continuing, you agree to our <a href="#" className="underline hover:text-blue-500">Terms of Service</a> and <a href="#" className="underline hover:text-blue-500">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
