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
      console.log("Selected word indices for validation:", indices);
    }
  }, [seedPhrase]);
  
  const handleInputChange = (index: number, value: string) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value.trim().toLowerCase();
    setInputValues(newInputValues);
  };
  
  const handleValidate = () => {
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
          
          <div className="bg-yellow-600/20 border border-yellow-600/50 p-4 rounded-lg flex gap-3">
            <AlertCircle className="text-yellow-500 flex-shrink-0 mt-1" size={20} />
            <div className="text-sm">
              <p className="font-medium text-yellow-500">Wichtiger Sicherheitshinweis</p>
              <p className="text-wallet-gray mt-1">Deine Seed Phrase ist der einzige Weg, um auf deine Wallet zuzugreifen. Stelle sicher, dass du sie sicher aufbewahrt hast.</p>
            </div>
          </div>
          
          <div className="space-y-5 bg-green-500/20 p-8 rounded-xl shadow-lg border-4 border-green-500">
            <h3 className="text-xl font-bold mb-6 text-white">Gib die folgenden Wörter ein:</h3>
            {wordIndices.map((wordIndex, index) => (
              <div key={index} className="space-y-3 mb-8">
                <label className="block text-white text-lg font-bold">Wort Nr. {wordIndex + 1}</label>
                <div className="relative">
                  <Input
                    value={inputValues[index]}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    className="bg-white text-black text-xl"
                    placeholder={`Gib das ${wordIndex + 1}. Wort ein`}
                    autoComplete="off"
                    style={{
                      boxShadow: '0 0 0 4px rgba(34, 197, 94, 0.2), 0 4px 16px rgba(0, 0, 0, 0.3)'
                    }}
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
              className="w-full py-8 text-lg bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg"
              disabled={inputValues.some(value => !value)}
              style={{
                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.5)'
              }}
            >
              Bestätigen
            </Button>
            
            <Button 
              onClick={handleViewSeedPhrase}
              variant="outline"
              className="w-full text-lg text-green-500 border-green-500 hover:bg-green-500/10 font-bold"
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
