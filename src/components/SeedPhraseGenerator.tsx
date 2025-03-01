
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Copy, RefreshCw } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { toast } from '@/components/ui/use-toast';

const SeedPhraseGenerator: React.FC = () => {
  const { seedPhrase, isGenerating, createWallet, copyToClipboard } = useWallet();
  const [copyAnimation, setCopyAnimation] = useState(false);
  
  const handleCopy = () => {
    if (seedPhrase.length >= 12) {
      const phraseText = seedPhrase.join(' ');
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
    console.log("Generate button clicked in SeedPhraseGenerator");
    createWallet();
  };

  // Log seed phrase for debugging
  useEffect(() => {
    console.log("SeedPhraseGenerator rendered with seedPhrase:", seedPhrase);
  }, [seedPhrase]);

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      <Card className="p-4 border border-gray-700 bg-wallet-card shadow-md rounded-xl">
        {seedPhrase.length >= 12 ? (
          <div className="grid grid-cols-3 gap-2 text-left">
            {seedPhrase.map((word, i) => (
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
          disabled={seedPhrase.length < 12 || isGenerating}
        >
          <Copy className={`h-4 w-4 mr-2 ${copyAnimation ? 'text-wallet-green' : ''}`} />
          Kopieren
        </Button>
      </div>
    </div>
  );
};

export default SeedPhraseGenerator;
