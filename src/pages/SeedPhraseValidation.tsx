
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, CheckCircle } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';

const SeedPhraseValidation: React.FC = () => {
  const { seedPhrase } = useWallet();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedWords, setSelectedWords] = useState<{index: number, word: string}[]>([]);
  const [userInputs, setUserInputs] = useState<string[]>(['', '', '']);
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);
  
  // Generate 3 random words from the seed phrase to validate
  useEffect(() => {
    if (!seedPhrase || seedPhrase.length < 12) {
      console.error("No valid seed phrase found, redirecting");
      toast({
        title: "Keine gültige Seed Phrase",
        description: "Du wirst zurück zur Seed Phrase-Seite geleitet",
        variant: "destructive",
      });
      navigate('/seed-phrase');
      return;
    }
    
    // Select 3 random words from the seed phrase
    const getRandomWordIndices = () => {
      const indices: number[] = [];
      while (indices.length < 3) {
        const randomIndex = Math.floor(Math.random() * seedPhrase.length);
        if (!indices.includes(randomIndex)) {
          indices.push(randomIndex);
        }
      }
      return indices.sort((a, b) => a - b); // Sort to maintain original order
    };
    
    const indices = getRandomWordIndices();
    const selectedWordsArray = indices.map(index => ({
      index,
      word: seedPhrase[index]
    }));
    
    console.log("Selected words for validation:", selectedWordsArray);
    setSelectedWords(selectedWordsArray);
  }, [seedPhrase, navigate, toast]);
  
  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...userInputs];
    newInputs[index] = value;
    setUserInputs(newInputs);
  };
  
  const validateInputs = () => {
    if (isValidating) return;
    
    setIsValidating(true);
    
    // Check if the user's inputs match the selected words
    const areAllValid = selectedWords.every((item, index) => 
      userInputs[index].toLowerCase().trim() === item.word.toLowerCase().trim()
    );
    
    console.log("Validation result:", areAllValid);
    
    if (areAllValid) {
      setIsValid(true);
      toast({
        title: "Validierung erfolgreich",
        description: "Deine Wallet wurde erfolgreich erstellt",
      });
      
      // Delay before navigating to wallet view
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      toast({
        title: "Validierung fehlgeschlagen",
        description: "Die eingegebenen Wörter stimmen nicht mit deiner Seed Phrase überein",
        variant: "destructive",
      });
      setIsValidating(false);
    }
  };
  
  const handleBackClick = () => {
    navigate('/seed-phrase');
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
                  disabled={isValidating || isValid}
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
            disabled={userInputs.some(input => !input.trim()) || isValidating || isValid}
          >
            {isValid ? (
              <>
                <CheckCircle size={16} className="mr-2" />
                Validiert
              </>
            ) : isValidating ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Validiere...
              </>
            ) : (
              "Validieren"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeedPhraseValidation;
