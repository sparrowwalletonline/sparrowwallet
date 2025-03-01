
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, RefreshCcw } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const SeedPhraseValidation: React.FC = () => {
  const { seedPhrase, createWallet, cancelWalletCreation } = useWallet();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // Shuffle seed phrase words for the validation
  useEffect(() => {
    if (seedPhrase && seedPhrase.length >= 12) {
      // Create a shuffled copy of the seed phrase
      const shuffled = [...seedPhrase].sort(() => Math.random() - 0.5);
      setShuffledWords(shuffled);
    }
  }, [seedPhrase]);
  
  const handleWordClick = (word: string, index: number) => {
    // Don't allow adding if already selected
    if (selectedWords.includes(word)) {
      return;
    }
    
    // Add word to selected words
    setSelectedWords([...selectedWords, word]);
    
    // Remove from shuffled list
    const newShuffled = [...shuffledWords];
    newShuffled.splice(index, 1);
    setShuffledWords(newShuffled);
  };
  
  const handleSelectedWordClick = (word: string, index: number) => {
    // Remove word from selected words
    const newSelected = [...selectedWords];
    newSelected.splice(index, 1);
    setSelectedWords(newSelected);
    
    // Add back to shuffled list
    setShuffledWords([...shuffledWords, word]);
  };
  
  const handleValidate = () => {
    // Check if selected words match the original seed phrase order
    const isValid = selectedWords.join(' ') === seedPhrase.join(' ');
    setIsCorrect(isValid);
    
    if (isValid) {
      toast({
        title: "Seed phrase validated successfully!",
        description: "Creating your wallet...",
        duration: 2000,
      });
      
      // Proceed to wallet creation
      setTimeout(() => {
        createWallet();
        navigate('/');
      }, 1500);
    } else {
      toast({
        title: "Validation failed",
        description: "The seed phrase order is incorrect. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };
  
  const handleReset = () => {
    // Reset the validation
    setSelectedWords([]);
    setShuffledWords([...seedPhrase].sort(() => Math.random() - 0.5));
    setIsCorrect(null);
  };
  
  const handleBackClick = () => {
    navigate('/seed-phrase');
  };

  return (
    <div className="min-h-screen flex flex-col bg-wallet-darkBg text-white p-6 animate-fade-in">
      <div className="absolute top-6 left-6">
        <button 
          onClick={handleBackClick}
          className="text-white hover:text-gray-300 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft size={24} />
        </button>
      </div>
      
      <div className="w-full text-center mt-6">
        <h1 className="font-heading text-xl font-medium">Validiere deine Seed Phrase</h1>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center py-6">
        <img 
          src="/lovable-uploads/592e4215-1f4a-4c0d-a1e9-504a24191442.png" 
          alt="Wallet Logo" 
          className="w-20 h-20 mb-6"
        />
        
        <div className="w-full max-w-sm space-y-6">
          <div className="text-left">
            <h2 className="text-xl font-bold mb-2">Validiere deine Seed Phrase</h2>
            <p className="text-wallet-gray text-sm mb-4">
              Wähle die Wörter in der richtigen Reihenfolge aus, um zu bestätigen, dass du deine Seed Phrase gesichert hast.
            </p>
          </div>
          
          {/* Selected words container */}
          <div className="bg-wallet-card p-4 rounded-lg border border-gray-700 min-h-24">
            <div className="flex flex-wrap gap-2">
              {selectedWords.length === 0 ? (
                <p className="text-wallet-gray text-sm">Klicke auf die Wörter unten, um sie in der richtigen Reihenfolge auszuwählen</p>
              ) : (
                selectedWords.map((word, index) => (
                  <button
                    key={`selected-${index}`}
                    onClick={() => handleSelectedWordClick(word, index)}
                    className="bg-wallet-blue py-1 px-3 rounded-full text-sm flex items-center"
                  >
                    <span className="mr-1">{word}</span>
                    <span className="text-xs text-gray-300">×</span>
                  </button>
                ))
              )}
            </div>
          </div>
          
          {/* Available words */}
          <div className="flex flex-wrap gap-2 justify-center">
            {shuffledWords.map((word, index) => (
              <button
                key={`word-${index}`}
                onClick={() => handleWordClick(word, index)}
                className="bg-wallet-card py-1 px-3 rounded-full text-sm hover:bg-gray-700 transition-colors"
              >
                {word}
              </button>
            ))}
          </div>
          
          <div className="flex flex-col space-y-3">
            <Button 
              onClick={handleValidate}
              className="w-full py-6 bg-wallet-blue hover:bg-wallet-darkBlue text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={selectedWords.length !== seedPhrase.length}
            >
              Validieren
            </Button>
            
            <Button 
              onClick={handleReset}
              variant="outline"
              className="w-full border-gray-700 text-wallet-gray"
            >
              <RefreshCcw size={16} className="mr-2" />
              Zurücksetzen
            </Button>
          </div>
          
          {isCorrect === false && (
            <div className="bg-red-900/30 border border-red-700 p-3 rounded-lg text-sm text-center">
              Die Reihenfolge ist nicht korrekt. Bitte versuche es erneut.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeedPhraseValidation;
