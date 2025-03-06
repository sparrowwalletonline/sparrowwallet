
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import WalletLogo from '@/components/WalletLogo';
import { useWallet } from '@/contexts/WalletContext';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

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
        // Add exit animation
        document.body.classList.add('page-exit');
        
        setTimeout(() => {
          navigate('/');
          toast({
            title: "Anmeldung erforderlich",
            description: "Bitte melde dich an, um fortzufahren",
            variant: "destructive",
          });
          
          // Remove class after navigation
          setTimeout(() => {
            document.body.classList.remove('page-exit');
          }, 50);
        }, 300);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        // Add exit animation
        document.body.classList.add('page-exit');
        
        setTimeout(() => {
          navigate('/');
          
          // Remove class after navigation
          setTimeout(() => {
            document.body.classList.remove('page-exit');
          }, 50);
        }, 300);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);
  
  const handleCreateWallet = () => {
    setIsLoading(true);
    
    // Add exit animation
    document.body.classList.add('page-exit');
    
    setTimeout(() => {
      navigate('/passphrase');
      setIsLoading(false);
      
      // Remove class after navigation
      setTimeout(() => {
        document.body.classList.remove('page-exit');
      }, 50);
    }, 300);
  };
  
  const handleImportWallet = () => {
    setIsImportLoading(true);
    
    // Add exit animation
    document.body.classList.add('page-exit');
    
    setTimeout(() => {
      importWallet("dummy phrase to trigger import UI");
      setIsImportLoading(false);
      
      // Remove class after navigation
      setTimeout(() => {
        document.body.classList.remove('page-exit');
      }, 50);
    }, 300);
  };

  const handleBackClick = () => {
    // Add exit animation
    document.body.classList.add('page-exit');
    
    setTimeout(() => {
      cancelWalletCreation();
      
      // Remove class after navigation
      setTimeout(() => {
        document.body.classList.remove('page-exit');
      }, 50);
    }, 300);
  };
  
  if (!session) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-wallet-darkBg to-[#151a25] text-white p-4 sm:p-6 relative page-enter safe-area-inset-bottom">
      <div className="w-full relative flex items-center justify-center">
        <button 
          onClick={handleBackClick}
          className="absolute left-2 sm:left-4 top-0 bottom-0 my-auto text-white hover:text-gray-300 transition-colors h-10 w-10 flex items-center justify-center touch-manipulation z-10"
          aria-label="Back to landing page"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-medium ml-10">Wallet auswählen</h1>
        </div>
      </div>
      
      <div className="flex-1"></div>
      
      <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 w-full max-w-md mb-auto pt-4">
        <div className="h-24 sm:h-32 w-24 sm:w-32 relative mb-4 sm:mb-6 animate-bounce-slow">
          <WalletLogo className="w-full h-full" color="sparrow" useSparrowLogo={true} scale={2.5} />
        </div>
        <h1 className="font-heading text-xl sm:text-3xl font-bold text-center">Sparrow Wallet</h1>
        <p className="text-center text-gray-300 max-w-xs mx-auto">
          Speichere und verwalte deine digitalen Assets sicher und einfach mit der Sparrow Wallet.
        </p>
      </div>
      
      <div className="flex-1"></div>
      
      <div className="w-full max-w-md px-4">
        <div className="bg-wallet-card/30 backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-white/5 shadow-lg">
          <div className="flex flex-col gap-3 sm:gap-4 mb-2">
            <Button 
              onClick={handleCreateWallet}
              className="w-full py-3 sm:py-6 text-sm sm:text-base bg-wallet-blue hover:bg-wallet-darkBlue text-white font-medium min-h-[50px] touch-manipulation hover:translate-y-[-2px] transition-all duration-300 shadow-md hover:shadow-lg"
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
              className="w-full py-2 sm:py-2 text-sm sm:text-base text-white hover:bg-gray-800/50 min-h-[44px] touch-manipulation hover:translate-y-[-2px] transition-all duration-300"
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
        </div>
      </div>
      
      <div className="text-center text-xs text-gray-500 mt-4 sm:mt-6">
        © 2025 Sparrow Wallet · v1.0.0
      </div>
    </div>
  );
};

export default WalletChoice;
