import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, CheckCircle } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';

const SeedPhraseValidation: React.FC = () => {
  const { seedPhrase, importWallet } = useWallet();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedWords, setSelectedWords] = useState<{index: number, word: string}[]>([]);
  const [userInputs, setUserInputs] = useState<string[]>(['', '', '']);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'creating' | 'valid'>('idle');
  const [activeSeedPhrase, setActiveSeedPhrase] = useState<string[]>([]);
  
  useEffect(() => {
    console.log("SeedPhraseValidation component mounted");
    console.log("Current seedPhrase in context:", seedPhrase);
    
    let phraseToUse = seedPhrase;
    
    if (!phraseToUse || phraseToUse.length < 12) {
      console.log("No valid seed phrase in context, checking localStorage");
      const savedSeedPhrase = localStorage.getItem('walletSeedPhrase');
      
      if (savedSeedPhrase) {
        try {
          const parsedPhrase = JSON.parse(savedSeedPhrase);
          if (Array.isArray(parsedPhrase) && parsedPhrase.length >= 12) {
            console.log("Found valid seed phrase in localStorage, length:", parsedPhrase.length);
            phraseToUse = parsedPhrase;
            
            importWallet(parsedPhrase);
          }
        } catch (error) {
          console.error("Error parsing seed phrase from localStorage:", error);
        }
      }
    }
    
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
    
    setActiveSeedPhrase(phraseToUse);
    
    selectRandomWords(phraseToUse);
  }, [seedPhrase, navigate, toast, importWallet]);
  
  const selectRandomWords = (phrase: string[]) => {
    const getRandomWordIndices = () => {
      const indices: number[] = [];
      while (indices.length < 3) {
        const randomIndex = Math.floor(Math.random() * phrase.length);
        if (!indices.includes(randomIndex)) {
          indices.push(randomIndex);
        }
      }
      return indices.sort((a, b) => a - b);
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
    
    const areAllValid = selectedWords.every((item, index) => 
      userInputs[index].toLowerCase().trim() === item.word.toLowerCase().trim()
    );
    
    console.log("Validation result:", areAllValid);
    
    if (areAllValid) {
      setTimeout(() => {
        setValidationStatus('creating');
        
        setTimeout(() => {
          setValidationStatus('valid');
          toast({
            title: "Validierung erfolgreich",
            description: "Deine Wallet wurde erfolgreich erstellt",
          });
          
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
    <div className="min-h-screen flex flex-col bg-white text-gray-800 p-4 sm:p-6 animate-fade-in page-enter safe-area-inset-bottom">
      <div className="w-full relative flex items-center justify-center mb-4">
        <button 
          onClick={handleBackClick}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors h-10 w-10 flex items-center justify-center touch-manipulation"
          aria-label="Back"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium">Wallet erstellen</h1>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center py-4 sm:py-6">
        <img 
          src="/lovable-uploads/592e4215-1f4a-4c0d-a1e9-504a24191442.png" 
          alt="Wallet Logo" 
          className="w-16 h-16 sm:w-24 sm:h-24 mb-4 sm:mb-6"
        />
        
        <div className="w-full max-w-sm space-y-4 sm:space-y-6 px-1">
          <div className="text-left">
            <h2 className="text-lg sm:text-xl font-bold mb-2">Bestätige deine Seed Phrase</h2>
            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
              Um sicherzustellen, dass du deine Seed Phrase korrekt aufgeschrieben hast, 
              gib bitte die folgenden Wörter ein:
            </p>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {selectedWords.map((item, index) => (
              <div key={index} className="space-y-1 sm:space-y-2">
                <label className="block text-xs sm:text-sm text-gray-600 font-medium">
                  Wort #{item.index + 1}:
                </label>
                <Input
                  type="text"
                  value={userInputs[index]}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  placeholder={`Gib das ${item.index + 1}. Wort ein`}
                  disabled={validationStatus !== 'idle'}
                  className="bg-gray-50 border-gray-200 text-gray-800 text-sm h-10 sm:h-12 touch-manipulation"
                />
              </div>
            ))}
          </div>
          
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-100 shadow-sm">
            <div className="flex items-start gap-2 sm:gap-3">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-xs sm:text-sm mb-1 text-gray-800">Wichtiger Hinweis</h3>
                <p className="text-xs text-gray-600">
                  Dies ist der letzte Schritt zur Erstellung deiner Wallet. 
                  Nach erfolgreicher Validierung wird deine Wallet aktiviert.
                </p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={validateInputs}
            className="w-full py-3 sm:py-6 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed min-h-[50px] touch-manipulation"
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
