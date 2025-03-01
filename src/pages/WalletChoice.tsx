
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import WalletLogo from '@/components/WalletLogo';
import { useWallet } from '@/contexts/WalletContext';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/Header';

const WalletChoice: React.FC = () => {
  const { generateWallet, importWallet, cancelWalletCreation } = useWallet();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  
  useEffect(() => {
    // Check for an active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      // If no session, redirect to landing page
      if (!session) {
        navigate('/');
        toast({
          title: "Anmeldung erforderlich",
          description: "Bitte melde dich an, um fortzufahren",
          variant: "destructive",
        });
      }
    });

    // Listen for authentication changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);
  
  const handleCreateWallet = () => {
    // Navigate to PassPhrase page
    navigate('/passphrase');
  };
  
  const handleImportWallet = () => {
    // For now, we'll just show import UI by setting a dummy phrase
    // The actual import functionality would be implemented later
    importWallet("dummy phrase to trigger import UI");
  };

  const handleBackClick = () => {
    cancelWalletCreation();
  };
  
  if (!session) {
    return null; // Don't render anything while checking authentication
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-wallet-darkBg text-white p-6 relative">
      <Header title="Wallet auswählen" />
      
      <button 
        onClick={handleBackClick}
        className="absolute top-6 left-6 text-white hover:text-gray-300 transition-colors"
        aria-label="Back to landing page"
      >
        <ArrowLeft size={24} />
      </button>
      
      <div className="flex-1"></div>
      
      <div className="flex flex-col items-center justify-center gap-6 w-full max-w-md mb-auto">
        <WalletLogo className="w-28 h-28 mb-6" color="green" />
        <h1 className="font-heading text-3xl font-bold text-center">Trust Wallet</h1>
      </div>
      
      <div className="flex-1"></div>
      
      <div className="flex flex-col w-full max-w-md gap-4 mb-10">
        <Button 
          onClick={handleCreateWallet}
          className="w-full py-6 text-base bg-wallet-blue hover:bg-wallet-darkBlue text-white font-medium"
        >
          Neue Wallet erstellen
        </Button>
        
        <Button 
          onClick={handleImportWallet}
          variant="ghost" 
          className="w-full py-2 text-base text-white hover:bg-gray-800/30"
        >
          Bestehende Wallet öffnen
        </Button>
        
        <Link to="/seed-phrase" className="w-full">
          <Button 
            variant="ghost" 
            className="w-full py-2 text-base text-white hover:bg-gray-800/30"
          >
            Seed Phrase verwalten
          </Button>
        </Link>
      </div>
      
      <div className="text-center text-xs text-gray-500 mt-4">
        © 2023 Trust Wallet
      </div>
    </div>
  );
};

export default WalletChoice;
