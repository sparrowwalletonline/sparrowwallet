
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, CheckCircle } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';

const SeedPhraseValidation: React.FC = () => {
  const { seedPhrase, importWallet } = useWallet();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedWords, setSelectedWords] = useState<{index: number, word: string}[]>([]);
  const [userInputs, setUserInputs] = useState<string[]>(['', '', '']);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'creating' | 'valid'>('idle');
  const [activeSeedPhrase, setActiveSeedPhrase] = useState<string[]>([]);
  
  // Find and setup the seed phrase for validation
  useEffect(() => {
    console.log("SeedPhraseValidation component mounted");
    console.log("Current seedPhrase in context:", seedPhrase);
    
    let phraseToUse = seedPhrase;
    
    // If no valid seed phrase in context, try localStorage
    if (!phraseToUse || phraseToUse.length < 12) {
      console.log("No valid seed phrase in context, checking localStorage");
      const savedSeedPhrase = localStorage.getItem('walletSeedPhrase');
      
      if (savedSeedPhrase) {
        try {
          const parsedPhrase = JSON.parse(savedSeedPhrase);
          if (Array.isArray(parsedPhrase) && parsedPhrase.length >= 12) {
            console.log("Found valid seed phrase in localStorage, length:", parsedPhrase.length);
            phraseToUse = parsedPhrase;
            
            // Update the context with the seed phrase from localStorage
            importWallet(parsedPhrase);
          }
        } catch (error) {
          console.error("Error parsing seed phrase from localStorage:", error);
        }
      }
    }
    
    // If we still don't have a valid phrase, redirect
    if (!phraseToUse || phraseToUse.length < 12) {
      console.error("No valid seed phrase found anywhere, redirecting");
      toast({
        title: "Keine gültige Seed Phrase",
        description: "Du wirst zurück zur Seed Phrase-Seite geleitet",
        variant: "destructive",
      });
      navigate('/seed-phrase');
      return;
    }
    
    // Store the active seed phrase in component state
    setActiveSeedPhrase(phraseToUse);
    
    // Select random words for validation
    selectRandomWords(phraseToUse);
  }, [seedPhrase, navigate, toast, importWallet]);
  
  // Helper function to select random words
  const selectRandomWords = (phrase: string[]) => {
    // Select 3 random words from the seed phrase
    const getRandomWordIndices = () => {
      const indices: number[] = [];
      while (indices.length < 3) {
        const randomIndex = Math.floor(Math.random() * phrase.length);
        if (!indices.includes(randomIndex)) {
          indices.push(randomIndex);
        }
      }
      return indices.sort((a, b) => a - b); // Sort to maintain original order
    };
    
    const indices = getRandomWordIndices();
    const selectedWordsArray = indices.map(index => ({
      index,
      word: phrase[index]
    }));
    
    console.log("Selected words for validation:", selectedWordsArray);
    setSelectedWords(selectedWordsArray);
  };
  
  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...userInputs];
    newInputs[index] = value;
    setUserInputs(newInputs);
  };
  
  const validateInputs = () => {
    if (validationStatus !== 'idle') return;
    
    setValidationStatus('validating');
    console.log("Validating inputs:", userInputs);
    console.log("Against selected words:", selectedWords);
    
    // Check if the user's inputs match the selected words
    const areAllValid = selectedWords.every((item, index) => 
      userInputs[index].toLowerCase().trim() === item.word.toLowerCase().trim()
    );
    
    console.log("Validation result:", areAllValid);
    
    if (areAllValid) {
      // First delay - validating
      setTimeout(() => {
        setValidationStatus('creating');
        
        // Second delay - creating wallet
        setTimeout(() => {
          setValidationStatus('valid');
          toast({
            title: "Validierung erfolgreich",
            description: "Deine Wallet wurde erfolgreich erstellt",
          });
          
          // Final delay before navigating
          setTimeout(() => {
            navigate('/congrats');
          }, 1000);
        }, 3000);
      }, 2000);
    } else {
      toast({
        title: "Validierung fehlgeschlagen",
        description: "Die eingegebenen Wörter stimmen nicht mit deiner Seed Phrase überein",
        variant: "destructive",
      });
      setValidationStatus('idle');
    }
  };
  
  const handleBackClick = () => {
    navigate('/seed-phrase');
  };
  
  // Helper function to get button text based on validation status
  const getButtonText = () => {
    switch (validationStatus) {
      case 'validating':
        return "Validiere...";
      case 'creating':
        return "Wallet wird erstellt...";
      case 'valid':
        return "Validiert!";
      default:
        return "Validieren";
    }
  };
  
  // Helper function to get button icon based on validation status
  const getButtonIcon = () => {
    switch (validationStatus) {
      case 'validating':
      case 'creating':
        return <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>;
      case 'valid':
        return <CheckCircle size={16} className="mr-2" />;
      default:
        return null;
    }
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
            <h2 className="text-xl font-bold mb-2">Bestätige deine Seed Phrase</h2>
            <p className="text-wallet-gray text-sm mb-4">
              Um sicherzustellen, dass du deine Seed Phrase korrekt aufgeschrieben hast, 
              gib bitte die folgenden Wörter ein:
            </p>
          </div>
          
          <div className="space-y-4">
            {selectedWords.map((item, index) => (
              <div key={index} className="space-y-2">
                <label className="block text-sm text-wallet-gray font-medium">
                  Wort #{item.index + 1}:
                </label>
                <Input
                  type="text"
                  value={userInputs[index]}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  placeholder={`Gib das ${item.index + 1}. Wort ein`}
                  disabled={validationStatus !== 'idle'}
                  className="bg-wallet-card border-gray-700 text-white"
                />
              </div>
            ))}
          </div>
          
          <div className="bg-wallet-card rounded-lg p-4 border border-gray-700 shadow-sm">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-wallet-green mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-sm mb-1">Wichtiger Hinweis</h3>
                <p className="text-xs text-wallet-gray">
                  Dies ist der letzte Schritt zur Erstellung deiner Wallet. 
                  Nach erfolgreicher Validierung wird deine Wallet aktiviert.
                </p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={validateInputs}
            className="w-full py-6 bg-wallet-blue hover:bg-wallet-darkBlue text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={userInputs.some(input => !input.trim()) || validationStatus !== 'idle'}
          >
            {getButtonIcon()}
            {getButtonText()}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeedPhraseValidation;
