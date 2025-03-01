import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';

const SeedPhraseValidation: React.FC = () => {
  const { seedPhrase, createWallet, cancelWalletCreation } = useWallet();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [wordIndices, setWordIndices] = useState<number[]>([]);
  const [inputValues, setInputValues] = useState<string[]>(['', '', '']);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  
  // Select three random word indices for validation
  useEffect(() => {
    if (seedPhrase && seedPhrase.length >= 12) {
      // Generate three random indices between 0-11
      const indices = [];
      while (indices.length < 3) {
        const randomIndex = Math.floor(Math.random() * 12);
        if (!indices.includes(randomIndex)) {
          indices.push(randomIndex);
        }
      }
      // Sort indices to display in order
      indices.sort((a, b) => a - b);
      setWordIndices(indices);
      console.log("Selected word indices for validation:", indices);
    }
  }, [seedPhrase]);
  
  const handleInputChange = (index: number, value: string) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value.trim().toLowerCase();
    setInputValues(newInputValues);
  };
  
  const handleValidate = () => {
    // Check if input words match the seed phrase words at the selected indices
    const isValid = wordIndices.every((wordIndex, index) => 
      inputValues[index] === seedPhrase[wordIndex]
    );
    
    setIsCorrect(isValid);
    
    if (isValid) {
      toast({
        title: "Validierung erfolgreich!",
        description: "Deine Wallet wird erstellt...",
        duration: 2000,
      });
      
      // Proceed to wallet creation
      setTimeout(() => {
        createWallet();
        navigate('/');
      }, 1500);
    } else {
      setAttemptsLeft(prev => prev - 1);
      
      if (attemptsLeft <= 1) {
        toast({
          title: "Zu viele fehlgeschlagene Versuche",
          description: "Bitte überprüfe deine Seed Phrase noch einmal.",
          variant: "destructive",
          duration: 3000,
        });
        setTimeout(() => {
          navigate('/seed-phrase');
        }, 2000);
      } else {
        toast({
          title: "Validierung fehlgeschlagen",
          description: `Die eingegebenen Wörter stimmen nicht mit deiner Passphrase überein. Noch ${attemptsLeft-1} Versuch(e) übrig.`,
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  };
  
  const handleBackClick = () => {
    navigate('/seed-phrase');
  };
  
  const handleViewSeedPhrase = () => {
    navigate('/seed-phrase');
  };

  return (
    <div className="min-h-screen flex flex-col bg-wallet-darkBg text-white p-6 animate-fade-in">
      <div className="w-full relative">
        <Header title="Passphrase bestätigen" />
        <button 
          onClick={handleBackClick}
          className="absolute left-4 top-0 bottom-0 my-auto text-white hover:text-gray-300 transition-colors h-9 w-9 flex items-center justify-center"
          aria-label="Zurück"
        >
          <ArrowLeft size={24} />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center py-6">
        <img 
          src="/lovable-uploads/592e4215-1f4a-4c0d-a1e9-504a24191442.png" 
          alt="Wallet Logo" 
          className="w-20 h-20 mb-6"
        />
        
        <div className="w-full max-w-sm space-y-6">
          <div className="text-left">
            <h2 className="text-xl font-bold mb-4">Fast fertig! Gib die folgenden Wörter Deiner Passphrase ein.</h2>
            <p className="text-wallet-gray text-sm mb-4">
              Um zu bestätigen, dass du deine Seed Phrase gesichert hast, gib bitte die angeforderten Wörter ein.
            </p>
          </div>
          
          {/* Seed phrase security info */}
          <div className="bg-yellow-600/20 border border-yellow-600/50 p-4 rounded-lg flex gap-3">
            <AlertCircle className="text-yellow-500 flex-shrink-0 mt-1" size={20} />
            <div className="text-sm">
              <p className="font-medium text-yellow-500">Wichtiger Sicherheitshinweis</p>
              <p className="text-wallet-gray mt-1">Deine Seed Phrase ist der einzige Weg, um auf deine Wallet zuzugreifen. Stelle sicher, dass du sie sicher aufbewahrt hast.</p>
            </div>
          </div>
          
          {/* Word input fields - Improved visibility */}
          <div className="space-y-5 bg-wallet-card p-5 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Gib die folgenden Wörter ein:</h3>
            {wordIndices.map((wordIndex, index) => (
              <div key={index} className="space-y-2">
                <label className="block text-wallet-gray font-medium">Wort Nr. {wordIndex + 1}</label>
                <Input
                  value={inputValues[index]}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className="bg-white text-black w-full p-4 rounded-md text-base border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                  placeholder={`Gib das ${wordIndex + 1}. Wort ein`}
                  autoComplete="off"
                />
              </div>
            ))}
          </div>
          
          {/* Attempts counter */}
          <div className="text-center text-wallet-gray text-sm font-medium">
            Verbleibende Versuche: <span className="text-white">{attemptsLeft}</span>
          </div>
          
          <div className="flex flex-col space-y-3 pt-4">
            <Button 
              onClick={handleValidate}
              className="w-full py-6 bg-green-600 hover:bg-green-700 text-white font-medium"
              disabled={inputValues.some(value => !value)}
            >
              Bestätigen
            </Button>
            
            <Button 
              onClick={handleViewSeedPhrase}
              variant="outline"
              className="w-full text-green-500 border-green-500 hover:bg-green-500/10"
            >
              Passphrase erneut anschauen
            </Button>
          </div>
          
          {isCorrect === false && (
            <div className="bg-red-900/30 border border-red-700 p-3 rounded-lg text-sm text-center">
              Die eingegebenen Wörter stimmen nicht mit deiner Passphrase überein.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeedPhraseValidation;
