
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
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      <header className="w-full p-6 flex justify-between items-center">
        <WalletLogo className="w-12 h-12" />
        <div className="w-8 h-8 flex flex-col gap-1.5 justify-center items-end cursor-pointer">
          <span className="block w-8 h-0.5 bg-gray-800"></span>
          <span className="block w-8 h-0.5 bg-gray-800"></span>
          <span className="block w-8 h-0.5 bg-gray-800"></span>
        </div>
      </header>
      
      <div className="flex-1 flex flex-col p-6">
        <div className="space-y-4 mb-8">
          <h1 className="text-4xl font-heading font-bold tracking-tight text-gray-900 leading-none">
            True crypto ownership.
            <br />
            Powerful Web3
            <br />
            experiences
          </h1>
          <p className="text-lg font-sans text-gray-600">
            Unlock the power of your cryptocurrency assets and explore the world of Web3 with Trusty Wallet.
          </p>
        </div>
        
        <Button 
          onClick={handleCreateWallet}
          className="w-full py-6 text-base flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all rounded-full"
        >
          Download Mobile App <ArrowRight className="h-4 w-4" />
        </Button>
        
        <div className="mt-12 relative">
          <img 
            src="/lovable-uploads/a2446f52-838c-4fb8-b6ba-73814411330e.png" 
            alt="Trusty Wallet Features" 
            className="w-full max-w-lg mx-auto" 
          />
        </div>
        
        <div className="mt-12 flex justify-between">
          <div className="text-center">
            <div className="text-blue-500 font-heading font-bold text-2xl">140M</div>
            <div className="text-gray-600">people</div>
          </div>
          <div className="text-center">
            <div className="text-blue-500 font-heading font-bold text-2xl">2017</div>
            <div className="text-gray-600">Founded in</div>
          </div>
        </div>
        
        <div className="text-center text-xs text-gray-500 mt-auto pt-6">
          By continuing, you agree to our <a href="#" className="underline hover:text-blue-500">Terms of Service</a> and <a href="#" className="underline hover:text-blue-500">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
