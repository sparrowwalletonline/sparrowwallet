import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Copy, RefreshCw, CloudUpload, CloudDownload } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { toast } from '@/components/ui/use-toast';
import { generateSeedPhrase as generateWalletSeedPhrase } from '@/utils/walletUtils';

interface SeedPhraseGeneratorProps {
  onSeedPhraseChange?: (seedPhrase: string[]) => void;
}

const SeedPhraseGenerator: React.FC<SeedPhraseGeneratorProps> = ({ onSeedPhraseChange }) => {
  const { 
    seedPhrase, 
    copyToClipboard, 
    importWallet, 
    session,
    saveToSupabase,
    loadFromSupabase
  } = useWallet();
  const [copyAnimation, setCopyAnimation] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localSeedPhrase, setLocalSeedPhrase] = useState<string[]>([]);
  const [hasProcessedSeedPhrase, setHasProcessedSeedPhrase] = useState(false);
  
  const generateLocalSeedPhrase = () => {
    try {
      setIsGenerating(true);
      console.log("Generating seed phrase locally in SeedPhraseGenerator");
      
      const words = generateWalletSeedPhrase();
      
      console.log("Generated word list (12 words):", words);
      
      setTimeout(() => {
        setLocalSeedPhrase(words);
        
        importWallet(words);
        console.log("Updated wallet context with new seed phrase");
        
        if (onSeedPhraseChange) {
          onSeedPhraseChange(words);
        }
        
        localStorage.setItem('walletSeedPhrase', JSON.stringify(words));
        
        setIsGenerating(false);
        
        toast({
          title: "Erfolg",
          description: "Seed-Phrase erfolgreich generiert",
          duration: 3000,
        });
      }, 500);
      
    } catch (error) {
      console.error("Error generating local seed phrase:", error);
      setIsGenerating(false);
      
      const fallbackPhrase = generateWalletSeedPhrase();
      setLocalSeedPhrase(fallbackPhrase);
      
      importWallet(fallbackPhrase);
      
      if (onSeedPhraseChange) {
        onSeedPhraseChange(fallbackPhrase);
      }
      
      toast({
        title: "Fehler",
        description: "Verwende Ersatz-Seed-Phrase aufgrund eines Generierungsfehlers",
        duration: 3000,
      });
    }
  };
  
  useEffect(() => {
    if (hasProcessedSeedPhrase) return;
    
    console.log("SeedPhraseGenerator mounted, checking for existing seed phrase");
    
    if (seedPhrase && seedPhrase.length >= 12) {
      console.log("Using existing seed phrase from context:", seedPhrase);
      setLocalSeedPhrase(seedPhrase);
      
      if (onSeedPhraseChange) {
        onSeedPhraseChange(seedPhrase);
      }
      
      setHasProcessedSeedPhrase(true);
    } else {
      const savedPhrase = localStorage.getItem('walletSeedPhrase');
      if (savedPhrase) {
        try {
          const parsedPhrase = JSON.parse(savedPhrase);
          if (Array.isArray(parsedPhrase) && parsedPhrase.length >= 12) {
            console.log("Using seed phrase from localStorage");
            setLocalSeedPhrase(parsedPhrase);
            
            importWallet(parsedPhrase);
            
            if (onSeedPhraseChange) {
              onSeedPhraseChange(parsedPhrase);
            }
            
            setHasProcessedSeedPhrase(true);
          } else {
            generateLocalSeedPhrase();
            setHasProcessedSeedPhrase(true);
          }
        } catch (error) {
          console.error("Error parsing seed phrase from localStorage:", error);
          generateLocalSeedPhrase();
          setHasProcessedSeedPhrase(true);
        }
      } else {
        generateLocalSeedPhrase();
        setHasProcessedSeedPhrase(true);
      }
    }
  }, [seedPhrase, importWallet, onSeedPhraseChange, hasProcessedSeedPhrase]); 
  
  const handleCopy = () => {
    if (localSeedPhrase && localSeedPhrase.length >= 12) {
      try {
        const phraseText = localSeedPhrase.join(' ');
        console.log("Copying to clipboard:", phraseText);
        
        navigator.clipboard.writeText(phraseText)
          .then(() => {
            console.log("Successfully copied to clipboard using navigator API");
            setCopyAnimation(true);
            setTimeout(() => setCopyAnimation(false), 1500);
            
            toast({
              title: "Kopiert!",
              description: "Seed-Phrase in die Zwischenablage kopiert",
              duration: 3000,
            });
          })
          .catch(err => {
            console.error("Navigator clipboard API failed:", err);
            copyToClipboard(phraseText);
          });
      } catch (error) {
        console.error("Copy operation failed:", error);
        toast({
          title: "Fehler",
          description: "Seed-Phrase konnte nicht kopiert werden",
          duration: 3000,
        });
      }
    } else {
      console.error("Cannot copy: localSeedPhrase is invalid", localSeedPhrase);
      toast({
        title: "Fehler",
        description: "Seed-Phrase konnte nicht kopiert werden",
        duration: 3000,
      });
    }
  };

  const handleGenerateWallet = () => {
    console.log("Generate button clicked - generating new seed phrase locally");
    generateLocalSeedPhrase();
  };

  const handleSaveToSupabase = async () => {
    if (!session) {
      toast({
        title: "Nicht eingeloggt",
        description: "Sie müssen eingeloggt sein, um Ihre Seed-Phrase zu speichern",
        duration: 3000,
      });
      return;
    }

    if (!localSeedPhrase || localSeedPhrase.length < 12) {
      toast({
        title: "Fehler",
        description: "Es gibt keine gültige Seed-Phrase zum Speichern",
        duration: 3000,
      });
      return;
    }

    setIsSaving(true);
    try {
      if (JSON.stringify(seedPhrase) !== JSON.stringify(localSeedPhrase)) {
        importWallet(localSeedPhrase);
      }
      
      await saveToSupabase();
      toast({
        title: "Gespeichert",
        description: "Seed-Phrase wurde erfolgreich gespeichert",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error saving to Supabase:", error);
      toast({
        title: "Fehler",
        description: "Seed-Phrase konnte nicht gespeichert werden",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadFromSupabase = async () => {
    if (!session) {
      toast({
        title: "Nicht eingeloggt",
        description: "Sie müssen eingeloggt sein, um Ihre Seed-Phrase zu laden",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await loadFromSupabase();
      if (success) {
        setLocalSeedPhrase(seedPhrase);
        
        if (onSeedPhraseChange) {
          onSeedPhraseChange(seedPhrase);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (seedPhrase && seedPhrase.length >= 12 && 
        JSON.stringify(localSeedPhrase) !== JSON.stringify(seedPhrase)) {
      setLocalSeedPhrase(seedPhrase);
      
      if (onSeedPhraseChange) {
        onSeedPhraseChange(seedPhrase);
      }
    }
  }, [seedPhrase, localSeedPhrase, onSeedPhraseChange]);

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      <Card className="p-4 border border-gray-200 bg-white shadow-md rounded-xl">
        {localSeedPhrase && localSeedPhrase.length >= 12 ? (
          <div className="grid grid-cols-3 gap-2 text-left">
            {localSeedPhrase.map((word, i) => (
              <div key={i} className="flex items-center">
                <span className="text-gray-400 w-5 text-xs">{i+1}.</span>
                <span className="font-medium text-gray-800">{word}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12 text-gray-400 italic text-sm">
            {isGenerating ? 'Generiere Seed-Phrase...' : 'Keine Seed-Phrase generiert. Klicken Sie unten auf "Neu generieren".'}
          </div>
        )}
      </Card>
      
      <div className="flex gap-3 flex-wrap">
        <Button 
          onClick={handleGenerateWallet} 
          variant="outline" 
          className="flex-1 h-12 bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-700 shadow-sm"
          disabled={isGenerating || isSaving || isLoading}
        >
          <RefreshCw 
            className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} 
          />
          Neu generieren
        </Button>
        
        <Button 
          onClick={handleCopy}
          variant="outline" 
          className="flex-1 h-12 bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-700 shadow-sm"
          disabled={!localSeedPhrase || localSeedPhrase.length < 12 || isGenerating || isSaving || isLoading}
        >
          <Copy className={`h-4 w-4 mr-2 ${copyAnimation ? 'text-green-500' : ''}`} />
          Kopieren
        </Button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Button 
          onClick={handleSaveToSupabase}
          variant="outline" 
          className="flex-1 h-12 bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-700 shadow-sm"
          disabled={!localSeedPhrase || localSeedPhrase.length < 12 || isGenerating || isSaving || isLoading || !session}
        >
          <CloudUpload className={`h-4 w-4 mr-2 ${isSaving ? 'animate-pulse' : ''}`} />
          {isSaving ? 'Speichern...' : 'In Cloud speichern'}
        </Button>
        
        <Button 
          onClick={handleLoadFromSupabase}
          variant="outline" 
          className="flex-1 h-12 bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-700 shadow-sm"
          disabled={isGenerating || isSaving || isLoading || !session}
        >
          <CloudDownload className={`h-4 w-4 mr-2 ${isLoading ? 'animate-pulse' : ''}`} />
          {isLoading ? 'Laden...' : 'Aus Cloud laden'}
        </Button>
      </div>
    </div>
  );
};

export default SeedPhraseGenerator;
