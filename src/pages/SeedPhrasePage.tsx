import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Check, ArrowLeft } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate, Link } from 'react-router-dom';
import SeedPhraseGenerator from '@/components/SeedPhraseGenerator';
import Header from '@/components/Header';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { checkExistingWallet } from '@/utils/supabaseWalletUtils';

const SeedPhrasePage: React.FC = () => {
  const { seedPhrase, cancelWalletCreation, session, saveToSupabase, saveWalletAddressToUserAccount, createWallet } = useWallet();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [savedPhrase, setSavedPhrase] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [hasShownToast, setHasShownToast] = useState(false);
  
  useEffect(() => {
    if (!seedPhrase || seedPhrase.length < 12) {
      console.log("No seed phrase found, creating wallet");
      createWallet();
    }
  }, [seedPhrase, createWallet]);
  
  useEffect(() => {
    if (seedPhrase && seedPhrase.length >= 12) {
      setSavedPhrase(true);
      setAgreedToTerms(true);
    }
  }, [seedPhrase]);
  
  useEffect(() => {
    const autoSaveToCloud = async () => {
      if (session && seedPhrase && seedPhrase.length >= 12 && !autoSaved && !hasShownToast) {
        try {
          const savedSeedPhrase = await saveToSupabase();
          
          if (savedSeedPhrase) {
            const hasExistingWallet = await checkExistingWallet(session.user.id);
            
            if (!hasExistingWallet) {
              const savedWalletAddress = await saveWalletAddressToUserAccount();
              
              if (savedWalletAddress) {
                setAutoSaved(true);
                setHasShownToast(true);
                toast({
                  title: "Automatisch gespeichert",
                  description: "Deine Seed Phrase und Wallet-Adresse wurden automatisch in der Cloud gesichert",
                  duration: 3000,
                });
              }
            } else {
              setAutoSaved(true);
              setHasShownToast(true);
              toast({
                title: "Automatisch gespeichert",
                description: "Deine Seed Phrase wurde automatisch in der Cloud gesichert",
                duration: 3000,
              });
            }
          }
        } catch (error) {
          console.error("Error auto-saving to Supabase:", error);
        }
      }
    };

    autoSaveToCloud();
  }, [session, seedPhrase, saveToSupabase, saveWalletAddressToUserAccount, autoSaved, toast, hasShownToast]);
  
  const handleConfirm = async () => {
    let phraseToUse = seedPhrase;
    
    if (!phraseToUse || phraseToUse.length < 12) {
      console.log("Checking localStorage for seed phrase");
      const savedSeedPhrase = localStorage.getItem('walletSeedPhrase');
      if (savedSeedPhrase) {
        try {
          const parsedPhrase = JSON.parse(savedSeedPhrase);
          if (Array.isArray(parsedPhrase) && parsedPhrase.length >= 12) {
            console.log("Found valid seed phrase in localStorage, length:", parsedPhrase.length);
            phraseToUse = parsedPhrase;
          }
        } catch (error) {
          console.error("Error parsing seed phrase from localStorage:", error);
        }
      }
    }
    
    if (!phraseToUse || phraseToUse.length < 12) {
      console.error("No valid seed phrase available anywhere:", phraseToUse);
      toast({
        title: "Keine Seed Phrase",
        description: "Bitte generiere zuerst eine Seed Phrase",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Confirming with seed phrase length:", phraseToUse.length);
    
    if (savedPhrase && agreedToTerms) {
      setIsConfirming(true);
      
      try {
        localStorage.setItem('walletSeedPhrase', JSON.stringify(phraseToUse));
        
        let allSuccess = true;
        
        if (session) {
          console.log("Saving seed phrase before validation");
          const savedSeedPhrase = await saveToSupabase();
          
          if (!savedSeedPhrase) {
            allSuccess = false;
            throw new Error("Fehler beim Speichern der Seed Phrase");
          }
          
          const hasExistingWallet = await checkExistingWallet(session.user.id);
          
          if (!hasExistingWallet) {
            console.log("User doesn't have a wallet yet, saving wallet address");
            await saveWalletAddressToUserAccount();
          } else {
            console.log("User already has a wallet, skipping wallet address saving");
          }
        }
        
        if (allSuccess) {
          setTimeout(() => {
            console.log("Navigating to validation page with seedPhrase length:", phraseToUse.length);
            navigate('/seed-phrase-validation');
            setIsConfirming(false);
          }, 500);
        } else {
          setIsConfirming(false);
        }
      } catch (error) {
        console.error("Error during confirmation:", error);
        toast({
          title: "Fehler",
          description: error instanceof Error ? error.message : "Ein Fehler ist aufgetreten",
          variant: "destructive",
        });
        setIsConfirming(false);
      }
    } else {
      toast({
        title: "Bitte bestätige",
        description: "Bitte bestätige, dass du die Seed Phrase gespeichert hast und den Nutzungsbedingungen zustimmst",
        variant: "destructive",
      });
    }
  };
  
  const handleBackClick = () => {
    cancelWalletCreation();
    navigate('/passphrase');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 p-4 sm:p-6 animate-fade-in page-enter safe-area-inset-bottom">
      <div className="w-full relative">
        <Header title="Wallet erstellen" />
        <button 
          onClick={handleBackClick}
          className="absolute left-2 sm:left-4 top-0 bottom-0 my-auto text-gray-600 hover:text-gray-800 transition-colors h-10 w-10 flex items-center justify-center touch-manipulation"
          aria-label="Back"
        >
          <ArrowLeft size={24} />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center py-4 sm:py-6">
        <img 
          src="/lovable-uploads/592e4215-1f4a-4c0d-a1e9-504a24191442.png" 
          alt="Wallet Logo" 
          className="w-16 h-16 sm:w-24 sm:h-24 mb-4 sm:mb-6"
        />
        
        <div className="w-full max-w-sm space-y-4 sm:space-y-6 px-1">
          <div className="text-left">
            <h2 className="text-lg sm:text-xl font-bold mb-2 text-gray-800">Deine Seed Phrase</h2>
            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
              Schreibe diese Wörter in der richtigen Reihenfolge auf. Bewahre sie sicher auf und teile sie mit niemandem.
            </p>
          </div>
          
          <SeedPhraseGenerator />
          
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-100 shadow-sm">
            <div className="flex items-start gap-2 sm:gap-3">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-xs sm:text-sm mb-1 text-gray-800">Bewahre deine Phrase sicher auf</h3>
                <p className="text-xs text-gray-600">
                  Deine Seed Phrase ist der einzige Weg, um deine Wallet wiederherzustellen, falls du den Zugriff verlierst. 
                  Schreibe sie auf und bewahre sie an einem sicheren Ort auf.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 mt-3 sm:mt-4">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="savedPhrase" 
                checked={savedPhrase} 
                onCheckedChange={(checked) => setSavedPhrase(checked === true)}
                className="data-[state=checked]:bg-blue-600 data-[state=checked]:text-white border-gray-300 mt-1"
              />
              <Label 
                htmlFor="savedPhrase" 
                className="text-xs sm:text-sm text-gray-600 cursor-pointer"
              >
                Ich habe die Seed Phrase an einem sicheren Ort gespeichert
              </Label>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="agreedToTerms" 
                checked={agreedToTerms} 
                onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                className="data-[state=checked]:bg-blue-600 data-[state=checked]:text-white border-gray-300 mt-1"
              />
              <Label 
                htmlFor="agreedToTerms" 
                className="text-xs sm:text-sm text-gray-600 cursor-pointer"
              >
                Ich stimme den <Link to="/terms" className="text-blue-600 underline">Nutzungsbedingungen</Link> zu
              </Label>
            </div>
          </div>
          
          <Button 
            onClick={handleConfirm}
            className="w-full py-3 sm:py-6 bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed min-h-[50px] touch-manipulation"
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
