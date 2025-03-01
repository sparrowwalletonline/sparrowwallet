
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Copy, RefreshCw } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';

const SeedPhraseGenerator: React.FC = () => {
  const { seedPhrase, isGenerating, createWallet, copyToClipboard } = useWallet();
  const [copyAnimation, setCopyAnimation] = useState(false);
  
  const handleCopy = () => {
    const phraseText = seedPhrase.join(' ');
    copyToClipboard(phraseText);
    setCopyAnimation(true);
    setTimeout(() => setCopyAnimation(false), 1500);
  };

  // Create a proper handler function that calls createWallet to generate a new seed phrase
  const handleGenerateWallet = () => {
    createWallet();
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in max-w-md mx-auto">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-center">Seed Phrase</h2>
        <p className="text-sm text-wallet-gray text-center">
          Write these words down in order. Keep them somewhere safe and never share them with anyone.
        </p>
      </div>
      
      <Card className="p-4 border border-slate-200 shadow-sm">
        {seedPhrase.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {seedPhrase.map((word, i) => (
              <div key={i} className="flex items-center">
                <span className="text-wallet-gray w-5 text-xs">{i+1}.</span>
                <span className="font-medium">{word}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12 text-wallet-gray italic text-sm">
            No seed phrase generated yet
          </div>
        )}
      </Card>
      
      <div className="flex gap-3">
        <Button 
          onClick={handleGenerateWallet} 
          variant="outline" 
          className="flex-1 bg-white border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
          disabled={isGenerating}
        >
          <RefreshCw 
            className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} 
          />
          Generate New
        </Button>
        
        <Button 
          onClick={handleCopy}
          variant="outline" 
          className="flex-1 bg-white border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
          disabled={seedPhrase.length === 0 || isGenerating}
        >
          <Copy className={`h-4 w-4 mr-2 ${copyAnimation ? 'clipboard-animation' : ''}`} />
          Copy
        </Button>
      </div>
    </div>
  );
};

export default SeedPhraseGenerator;
