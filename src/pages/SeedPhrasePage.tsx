
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, Copy, RefreshCw, Check, ArrowLeft } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const SeedPhrasePage: React.FC = () => {
  const { seedPhrase, createWallet, copyToClipboard, cancelWalletCreation } = useWallet();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedPhrase, setSavedPhrase] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [copyAnimation, setCopyAnimation] = useState(false);
  
  // Generate a seed phrase on component mount if one doesn't exist
  useEffect(() => {
    if (seedPhrase.length <= 2) { // If we don't have a real seed phrase yet
      createWallet(); // Generate the seed phrase immediately when component mounts
    }
  }, []);
  
  const handleRegeneratePhrase = () => {
    setIsGenerating(true);
    // Call createWallet directly to generate a new seed phrase
    createWallet();
    setTimeout(() => {
      setIsGenerating(false);
    }, 600);
    
    // Reset checkboxes when regenerating
    setSavedPhrase(false);
    setAgreedToTerms(false);
  };
  
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
  
  const handleConfirm = () => {
    if (savedPhrase && agreedToTerms) {
      // In a real app, you would proceed to the next step here
      toast({
        title: "Seed phrase confirmed!",
        description: "Your wallet is being created...",
        duration: 2000,
      });
    }
  };
  
  const handleBackClick = () => {
    cancelWalletCreation();
  };
  
  // Now we add a console log to debug the seed phrase
  console.log("Current seed phrase:", seedPhrase);
  
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
        <h1 className="font-heading text-xl font-medium">Wallet erstellen</h1>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center py-6">
        <img 
          src="/lovable-uploads/592e4215-1f4a-4c0d-a1e9-504a24191442.png" 
          alt="Wallet Logo" 
          className="w-24 h-24 mb-6"
        />
        
        <div className="w-full max-w-sm space-y-6">
          <div className="text-left">
            <h2 className="text-xl font-bold mb-2">Deine Seed Phrase</h2>
            <p className="text-wallet-gray text-sm mb-4">
              Schreibe diese Wörter in der richtigen Reihenfolge auf. Bewahre sie sicher auf und teile sie mit niemandem.
            </p>
          </div>
          
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
              onClick={handleRegeneratePhrase} 
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
          
          <div className="bg-wallet-card rounded-lg p-4 border border-gray-700 shadow-sm">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-wallet-green mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-sm mb-1">Bewahre deine Phrase sicher auf</h3>
                <p className="text-xs text-wallet-gray">
                  Deine Seed Phrase ist der einzige Weg, um deine Wallet wiederherzustellen, falls du den Zugriff verlierst. 
                  Schreibe sie auf und bewahre sie an einem sicheren Ort auf.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 mt-4">
            <label className="flex items-start gap-2 cursor-pointer">
              <div className="flex items-center h-5 mt-0.5">
                <input
                  type="checkbox"
                  checked={savedPhrase}
                  onChange={(e) => setSavedPhrase(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-600 text-wallet-blue focus:ring-wallet-blue"
                />
              </div>
              <span className="text-sm text-wallet-gray">
                Ich habe die Seed Phrase an einem sicheren Ort gespeichert
              </span>
            </label>
            
            <label className="flex items-start gap-2 cursor-pointer">
              <div className="flex items-center h-5 mt-0.5">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-600 text-wallet-blue focus:ring-wallet-blue"
                />
              </div>
              <span className="text-sm text-wallet-gray">
                Ich stimme den <Link to="/terms" className="text-wallet-blue underline">Nutzungsbedingungen</Link> zu
              </span>
            </label>
          </div>
          
          <Button 
            onClick={handleConfirm}
            className="w-full py-6 bg-wallet-blue hover:bg-wallet-darkBlue text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!savedPhrase || !agreedToTerms}
          >
            {savedPhrase && agreedToTerms ? (
              <>
                <Check size={16} className="mr-2" />
                Bestätigen
              </>
            ) : (
              "Bestätigen"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeedPhrasePage;
