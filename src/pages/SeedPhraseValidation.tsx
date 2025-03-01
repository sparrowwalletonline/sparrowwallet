
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';

const SeedPhraseValidation: React.FC = () => {
  const { seedPhrase, createWallet, cancelWalletCreation } = useWallet();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [wordIndices, setWordIndices] = useState<number[]>([]);
  const [inputValues, setInputValues] = useState<string[]>(['', '', '']);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  
  useEffect(() => {
    if (seedPhrase && seedPhrase.length >= 12) {
      const indices = [];
      while (indices.length < 3) {
        const randomIndex = Math.floor(Math.random() * 12);
        if (!indices.includes(randomIndex)) {
          indices.push(randomIndex);
        }
      }
      indices.sort((a, b) => a - b);
      setWordIndices(indices);
      console.log("Selected word indices for validation:", indices, "SeedPhrase length:", seedPhrase.length);
    } else {
      console.error("SeedPhrase is missing or invalid:", seedPhrase);
    }
  }, [seedPhrase]);
  
  const handleInputChange = (index: number, value: string) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value.trim().toLowerCase();
    setInputValues(newInputValues);
    console.log("Input changed:", index, value, "New values:", newInputValues);
  };
  
  const handleValidate = () => {
    console.log("Validating inputs:", inputValues);
    console.log("Against seed phrase words:", wordIndices.map(i => seedPhrase[i]));
    
    const isValid = wordIndices.every((wordIndex, index) => {
      const match = inputValues[index] === seedPhrase[wordIndex];
      console.log(`Comparing input ${index} (${inputValues[index]}) with word ${wordIndex} (${seedPhrase[wordIndex]}): ${match}`);
      return match;
    });
    
    setIsCorrect(isValid);
    
    if (isValid) {
      toast({
        title: "Validierung erfolgreich!",
        description: "Deine Wallet wird erstellt...",
        duration: 2000,
      });
      
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

  if (!seedPhrase || seedPhrase.length < 12) {
    console.error("SeedPhrase is missing or invalid, redirecting to seed-phrase page");
    navigate('/seed-phrase');
    return null;
  }

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
          
          <div className="bg-yellow-600/20 border border-yellow-600/50 p-4 rounded-lg flex gap-3">
            <AlertCircle className="text-yellow-500 flex-shrink-0 mt-1" size={20} />
            <div className="text-sm">
              <p className="font-medium text-yellow-500">Wichtiger Sicherheitshinweis</p>
              <p className="text-wallet-gray mt-1">Deine Seed Phrase ist der einzige Weg, um auf deine Wallet zuzugreifen. Stelle sicher, dass du sie sicher aufbewahrt hast.</p>
            </div>
          </div>
          
          <div className="space-y-5 bg-green-900/30 p-6 rounded-xl shadow-lg border border-green-500">
            <h3 className="text-xl font-bold mb-4 text-white">Gib die folgenden Wörter ein:</h3>
            
            {wordIndices.map((wordIndex, index) => (
              <div key={index} className="mb-6">
                <label className="block text-white text-lg font-bold mb-2">
                  Wort Nr. {wordIndex + 1}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={inputValues[index]}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    className="w-full h-14 bg-white text-black text-lg font-medium px-4 py-3 rounded-lg border-2 border-green-500 focus:border-green-400 focus:outline-none"
                    placeholder={`Gib das ${wordIndex + 1}. Wort ein`}
                    autoComplete="off"
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center text-wallet-gray text-lg font-medium">
            Verbleibende Versuche: <span className="text-white font-bold">{attemptsLeft}</span>
          </div>
          
          <div className="flex flex-col space-y-4 pt-6">
            <Button 
              onClick={handleValidate}
              className="w-full py-6 text-lg bg-green-600 hover:bg-green-700 text-white font-bold"
              disabled={inputValues.some(value => !value)}
            >
              Bestätigen
            </Button>
            
            <Button 
              onClick={handleViewSeedPhrase}
              variant="outline"
              className="w-full py-6 text-lg text-green-500 border-green-500 hover:bg-green-500/10 font-bold"
            >
              Passphrase erneut anschauen
            </Button>
          </div>
          
          {isCorrect === false && (
            <div className="bg-red-900/30 border border-red-700 p-5 rounded-lg text-base text-center font-bold">
              Die eingegebenen Wörter stimmen nicht mit deiner Passphrase überein.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeedPhraseValidation;
