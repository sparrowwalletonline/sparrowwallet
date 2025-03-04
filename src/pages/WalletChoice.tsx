
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import WalletLogo from '@/components/WalletLogo';
import { useWallet } from '@/contexts/WalletContext';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/Header';

const WalletChoice: React.FC = () => {
  const { generateWallet, importWallet, cancelWalletCreation } = useWallet();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImportLoading, setIsImportLoading] = useState(false);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (!session) {
        navigate('/');
        toast({
          title: "Anmeldung erforderlich",
          description: "Bitte melde dich an, um fortzufahren",
          variant: "destructive",
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);
  
  const handleCreateWallet = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      navigate('/passphrase');
      setIsLoading(false);
    }, 3000);
  };
  
  const handleImportWallet = () => {
    setIsImportLoading(true);
    
    setTimeout(() => {
      importWallet("dummy phrase to trigger import UI");
      setIsImportLoading(false);
    }, 3000);
  };

  const handleBackClick = () => {
    cancelWalletCreation();
  };
  
  if (!session) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-wallet-darkBg text-white p-4 sm:p-6 relative">
      <div className="w-full relative">
        <Header title="Wallet auswählen" />
        <button 
          onClick={handleBackClick}
          className="absolute left-2 sm:left-4 top-0 bottom-0 my-auto text-white hover:text-gray-300 transition-colors h-9 w-9 flex items-center justify-center"
          aria-label="Back to landing page"
        >
          <ArrowLeft size={24} />
        </button>
      </div>
      
      <div className="flex-1"></div>
      
      <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 w-full max-w-md mb-auto pt-4">
        <WalletLogo className="w-20 h-20 sm:w-28 sm:h-28 mb-4 sm:mb-6" color="green" />
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-center">Trust Wallet</h1>
      </div>
      
      <div className="flex-1"></div>
      
      <div className="flex flex-col w-full max-w-md gap-3 sm:gap-4 mb-6 sm:mb-10">
        <Button 
          onClick={handleCreateWallet}
          className="w-full py-4 sm:py-6 text-sm sm:text-base bg-wallet-blue hover:bg-wallet-darkBlue text-white font-medium"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Wallet wird vorbereitet...
            </>
          ) : (
            "Neue Wallet erstellen"
          )}
        </Button>
        
        <Button 
          onClick={handleImportWallet}
          variant="ghost" 
          className="w-full py-1 sm:py-2 text-sm sm:text-base text-white hover:bg-gray-800/30"
          disabled={isLoading || isImportLoading}
        >
          {isImportLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Wallet wird geöffnet...
            </>
          ) : (
            "Bestehende Wallet öffnen"
          )}
        </Button>
      </div>
      
      <div className="text-center text-xs text-gray-500 mt-2 sm:mt-4">
        © 2025 Trust Wallet
      </div>
    </div>
  );
};

export default WalletChoice;
