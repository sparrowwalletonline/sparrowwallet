
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Check, ArrowLeft } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate, Link } from 'react-router-dom';
import SeedPhraseGenerator from '@/components/SeedPhraseGenerator';
import Header from '@/components/Header';

const SeedPhrasePage: React.FC = () => {
  const { seedPhrase, cancelWalletCreation, session, saveToSupabase } = useWallet();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [savedPhrase, setSavedPhrase] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  
  // Pre-fill checkboxes if coming back from validation page
  useEffect(() => {
    if (seedPhrase && seedPhrase.length >= 12) {
      setSavedPhrase(true);
      setAgreedToTerms(true);
    }
  }, [seedPhrase]);

  // Auto-save to Supabase if user is logged in
  useEffect(() => {
    const autoSaveToCloud = async () => {
      if (session && seedPhrase && seedPhrase.length >= 12 && !autoSaved) {
        try {
          const saved = await saveToSupabase();
          if (saved) {
            setAutoSaved(true);
            toast({
              title: "Automatisch gespeichert",
              description: "Deine Seed Phrase wurde automatisch in der Cloud gesichert",
              duration: 3000,
            });
          }
        } catch (error) {
          console.error("Error auto-saving to Supabase:", error);
        }
      }
    };

    autoSaveToCloud();
  }, [session, seedPhrase, saveToSupabase, autoSaved, toast]);
  
  const handleConfirm = async () => {
    if (!seedPhrase || seedPhrase.length < 12) {
      toast({
        title: "Keine Seed Phrase",
        description: "Bitte generiere zuerst eine Seed Phrase",
        variant: "destructive",
      });
      return;
    }
    
    if (savedPhrase && agreedToTerms) {
      setIsConfirming(true);
      
      try {
        // Ensure the seed phrase is saved to Supabase before proceeding
        if (session) {
          console.log("Saving seed phrase to user account before validation");
          const saved = await saveToSupabase();
          if (!saved) {
            throw new Error("Fehler beim Speichern der Seed Phrase");
          }
        }
        
        // Add a delay to improve the UX
        setTimeout(() => {
          console.log("Navigating to validation page with seedPhrase:", seedPhrase);
          navigate('/seed-phrase-validation');
          setIsConfirming(false);
        }, 1000);
      } catch (error) {
        console.error("Error during confirmation:", error);
        toast({
          title: "Fehler",
          description: error instanceof Error ? error.message : "Ein Fehler ist aufgetreten",
          variant: "destructive",
        });
        setIsConfirming(false);
      }
    }
  };
  
  const handleBackClick = () => {
    cancelWalletCreation();
    navigate('/passphrase');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-wallet-darkBg text-white p-6 animate-fade-in">
      <div className="w-full relative">
        <Header title="Wallet erstellen" />
        <button 
          onClick={handleBackClick}
          className="absolute left-4 top-0 bottom-0 my-auto text-white hover:text-gray-300 transition-colors h-9 w-9 flex items-center justify-center"
          aria-label="Back"
        >
          <ArrowLeft size={24} />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center py-6">
        <img 
          src="/lovable-uploads/592e4215-1f4a-4c0d-a1e9-504a24191442.png" 
          alt="Wallet Logo" 
          className="w-24 h-24 mb-6"
        />
        
        <div className="w-full max-w-sm space-y-6">
          <div className="text-left">
            <h2 className="text-xl font-bold mb-2">Deine Seed Phrase</h2>
            <p className="text-wallet-gray text-sm mb-4">
              Schreibe diese Wörter in der richtigen Reihenfolge auf. Bewahre sie sicher auf und teile sie mit niemandem.
            </p>
          </div>
          
          <SeedPhraseGenerator />
          
          <div className="bg-wallet-card rounded-lg p-4 border border-gray-700 shadow-sm">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-wallet-green mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-sm mb-1">Bewahre deine Phrase sicher auf</h3>
                <p className="text-xs text-wallet-gray">
                  Deine Seed Phrase ist der einzige Weg, um deine Wallet wiederherzustellen, falls du den Zugriff verlierst. 
                  Schreibe sie auf und bewahre sie an einem sicheren Ort auf.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 mt-4">
            <label className="flex items-start gap-2 cursor-pointer">
              <div className="flex items-center h-5 mt-0.5">
                <input
                  type="checkbox"
                  checked={savedPhrase}
                  onChange={(e) => setSavedPhrase(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-600 text-wallet-blue focus:ring-wallet-blue"
                />
              </div>
              <span className="text-sm text-wallet-gray">
                Ich habe die Seed Phrase an einem sicheren Ort gespeichert
              </span>
            </label>
            
            <label className="flex items-start gap-2 cursor-pointer">
              <div className="flex items-center h-5 mt-0.5">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-600 text-wallet-blue focus:ring-wallet-blue"
                />
              </div>
              <span className="text-sm text-wallet-gray">
                Ich stimme den <Link to="/terms" className="text-wallet-blue underline">Nutzungsbedingungen</Link> zu
              </span>
            </label>
          </div>
          
          <Button 
            onClick={handleConfirm}
            className="w-full py-6 bg-wallet-blue hover:bg-wallet-darkBlue text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!savedPhrase || !agreedToTerms || isConfirming}
          >
            {isConfirming ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Bestätigen...
              </>
            ) : savedPhrase && agreedToTerms ? (
              <>
                <Check size={16} className="mr-2" />
                Bestätigen
              </>
            ) : (
              "Bestätigen"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeedPhrasePage;
