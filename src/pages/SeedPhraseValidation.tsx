
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Input } from '@/components/ui/input';

const SeedPhraseValidation: React.FC = () => {
  const { seedPhrase, createWallet } = useWallet();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [wordIndices, setWordIndices] = useState<number[]>([]);
  const [inputValues, setInputValues] = useState<{[key: number]: string}>({});
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Redirect if no seed phrase is available
  useEffect(() => {
    if (!seedPhrase || seedPhrase.length < 12) {
      console.error("No valid seed phrase found, redirecting to seed phrase page");
      toast({
        title: "Keine gültige Passphrase gefunden",
        description: "Du wirst zurück zur Passphrase-Seite geleitet",
        variant: "destructive",
      });
      navigate('/seed-phrase');
    }
  }, [seedPhrase, navigate, toast]);
  
  // Generate random indices for validation
  useEffect(() => {
    if (seedPhrase && seedPhrase.length >= 12) {
      console.log("Generating random indices for validation");
      // Generate three random unique indices between 0-11
      const indices: number[] = [];
      while (indices.length < 3) {
        const randomIndex = Math.floor(Math.random() * 12);
        if (!indices.includes(randomIndex)) {
          indices.push(randomIndex);
        }
      }
      // Sort indices to display in ascending order
      indices.sort((a, b) => a - b);
      setWordIndices(indices);
      console.log("Selected word indices:", indices);
    }
  }, [seedPhrase]);
  
  // Handle input change
  const handleInputChange = useCallback((index: number, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [index]: value.trim().toLowerCase()
    }));
  }, []);
  
  // Validate seed phrase
  const validateSeedPhrase = useCallback(() => {
    console.log("Validating seed phrase");
    setIsVerifying(true);
    
    let isValid = true;
    
    // Check each requested word
    for (const index of wordIndices) {
      const expectedWord = seedPhrase[index];
      const enteredWord = inputValues[index] || '';
      
      console.log(`Validating word at index ${index}:`);
      console.log(`- Expected: "${expectedWord}"`);
      console.log(`- Entered: "${enteredWord}"`);
      
      if (enteredWord !== expectedWord) {
        isValid = false;
        console.log(`- Validation failed for word ${index + 1}`);
        break;
      }
    }
    
    if (isValid) {
      console.log("Validation successful, creating wallet");
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
      console.log("Validation failed");
      toast({
        title: "Validierung fehlgeschlagen",
        description: "Die eingegebenen Wörter stimmen nicht mit deiner Passphrase überein.",
        variant: "destructive",
        duration: 3000,
      });
      
      // Reset input values on failure
      setInputValues({});
    }
    
    setIsVerifying(false);
  }, [wordIndices, inputValues, seedPhrase, createWallet, navigate, toast]);
  
  // Handle back button
  const handleBack = () => {
    navigate('/seed-phrase');
  };
  
  // View seed phrase again
  const viewSeedPhrase = () => {
    navigate('/seed-phrase');
  };
  
  // Safety check to prevent render before we have wordIndices
  if (!seedPhrase || seedPhrase.length < 12 || wordIndices.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-white text-black p-6 animate-fade-in">
      <div className="w-full relative mb-10">
        <Header title="Passphrase bestätigen" />
        <button 
          onClick={handleBack}
          className="absolute left-0 top-0 bottom-0 my-auto text-black hover:text-gray-600 transition-colors h-9 w-9 flex items-center justify-center"
          aria-label="Zurück"
        >
          <ArrowLeft size={24} />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col">
        <h2 className="text-xl font-medium mb-4">
          Fast fertig! Gib die folgenden Wörter Deiner Passphrase ein.
        </h2>
        
        <p className="text-gray-600 mb-6">
          Um sicherzustellen, dass du deine Passphrase aufgeschrieben hast, gib bitte die folgenden Wörter ein:
        </p>
        
        <div className="space-y-8 mt-6 mb-auto">
          {wordIndices.map((wordIndex) => (
            <div key={wordIndex} className="mb-6">
              <label className="block text-gray-600 mb-2">
                Wort Nr. {wordIndex + 1}
              </label>
              <Input
                type="text"
                value={inputValues[wordIndex] || ''}
                onChange={(e) => handleInputChange(wordIndex, e.target.value)}
                className="w-full h-16 bg-gray-100 text-black px-4 py-3 rounded-lg focus:outline-none"
                placeholder={`Gib das ${wordIndex + 1}. Wort ein`}
                autoComplete="off"
              />
            </div>
          ))}
        </div>
        
        <div className="mt-auto space-y-4 pt-4">
          <Button 
            onClick={validateSeedPhrase}
            className="w-full h-14 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg shadow-none border-none"
            disabled={wordIndices.some(index => !inputValues[index]) || isVerifying}
          >
            {isVerifying ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Überprüfe...
              </>
            ) : (
              "Bestätigen"
            )}
          </Button>
          
          <Button 
            onClick={viewSeedPhrase}
            variant="outline"
            className="w-full h-12 bg-transparent hover:bg-transparent text-green-600 hover:text-green-700 border-none shadow-none font-medium"
          >
            Passphrase erneut anschauen
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeedPhraseValidation;
