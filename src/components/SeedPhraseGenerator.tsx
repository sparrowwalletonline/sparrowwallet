
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Copy, RefreshCw } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { toast } from '@/components/ui/use-toast';
import * as bip39 from 'bip39';

const SeedPhraseGenerator: React.FC = () => {
  const { copyToClipboard } = useWallet();
  const [copyAnimation, setCopyAnimation] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [localSeedPhrase, setLocalSeedPhrase] = useState<string[]>([]);
  
  // Generate seed phrase directly in this component
  const generateSeedPhrase = () => {
    try {
      setIsGenerating(true);
      console.log("Generating seed phrase locally in SeedPhraseGenerator");
      
      // Generate a random mnemonic (128 bits = 12 words)
      const mnemonic = bip39.generateMnemonic(128);
      console.log("Generated BIP39 mnemonic locally:", mnemonic);
      
      const words = mnemonic.split(' ');
      console.log("Local BIP39 word list (should be 12 words):", words);
      
      // Add a small delay to show loading state
      setTimeout(() => {
        setLocalSeedPhrase(words);
        setIsGenerating(false);
        
        toast({
          title: "Success",
          description: "Seed phrase generated successfully",
          duration: 2000,
        });
      }, 500);
      
    } catch (error) {
      console.error("Error generating local seed phrase:", error);
      setIsGenerating(false);
      
      // Fallback to hardcoded phrase on error
      const fallbackPhrase = ["ability", "dinner", "canvas", "trash", "paper", "volcano", "energy", "horse", "author", "basket", "melody", "vintage"];
      setLocalSeedPhrase(fallbackPhrase);
      
      toast({
        title: "Error",
        description: "Using fallback seed phrase due to generation error",
        duration: 3000,
      });
    }
  };
  
  // Generate seed phrase on component mount
  useEffect(() => {
    generateSeedPhrase();
  }, []);
  
  const handleCopy = () => {
    if (localSeedPhrase && localSeedPhrase.length >= 12) {
      const phraseText = localSeedPhrase.join(' ');
      copyToClipboard(phraseText);
      setCopyAnimation(true);
      setTimeout(() => setCopyAnimation(false), 1500);
      
      toast({
        title: "Copied!",
        description: "Seed phrase copied to clipboard",
        duration: 2000,
      });
    }
  };

  const handleGenerateWallet = () => {
    console.log("Generate button clicked - generating new seed phrase locally");
    generateSeedPhrase();
  };

  useEffect(() => {
    console.log("SeedPhraseGenerator rendered with local seedPhrase:", 
      localSeedPhrase ? localSeedPhrase.join(' ') : 'undefined');
  }, [localSeedPhrase]);

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      <Card className="p-4 border border-gray-700 bg-wallet-card shadow-md rounded-xl">
        {localSeedPhrase && localSeedPhrase.length >= 12 ? (
          <div className="grid grid-cols-3 gap-2 text-left">
            {localSeedPhrase.map((word, i) => (
              <div key={i} className="flex items-center">
                <span className="text-wallet-gray w-5 text-xs">{i+1}.</span>
                <span className="font-medium text-white">{word}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12 text-wallet-gray italic text-sm">
            {isGenerating ? 'Generiere Seed Phrase...' : 'Keine Seed Phrase generiert'}
          </div>
        )}
      </Card>
      
      <div className="flex gap-3">
        <Button 
          onClick={handleGenerateWallet} 
          variant="outline" 
          className="flex-1 h-12 bg-wallet-card border-gray-700 text-white hover:bg-wallet-darkGray shadow-sm"
          disabled={isGenerating}
        >
          <RefreshCw 
            className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} 
          />
          Neu generieren
        </Button>
        
        <Button 
          onClick={handleCopy}
          variant="outline" 
          className="flex-1 h-12 bg-wallet-card border-gray-700 text-white hover:bg-wallet-darkGray shadow-sm"
          disabled={!localSeedPhrase || localSeedPhrase.length < 12 || isGenerating}
        >
          <Copy className={`h-4 w-4 mr-2 ${copyAnimation ? 'text-wallet-green' : ''}`} />
          Kopieren
        </Button>
      </div>
    </div>
  );
};

export default SeedPhraseGenerator;
