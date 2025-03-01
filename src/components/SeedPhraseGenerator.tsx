
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Copy, RefreshCw } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { toast } from '@/components/ui/use-toast';

// BIP39 wordlist (English)
const wordlist = [
  "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", "absurd", "abuse",
  "access", "accident", "account", "accuse", "achieve", "acid", "acoustic", "acquire", "across", "act",
  "action", "actor", "actress", "actual", "adapt", "add", "addict", "address", "adjust", "admit",
  "adult", "advance", "advice", "aerobic", "affair", "afford", "afraid", "again", "age", "agent",
  "agree", "ahead", "aim", "air", "airport", "aisle", "alarm", "album", "alcohol", "alert",
  "alien", "all", "alley", "allow", "almost", "alone", "alpha", "already", "also", "alter",
  "always", "amateur", "amazing", "among", "amount", "amused", "analyst", "anchor", "ancient", "anger",
  "angle", "angry", "animal", "ankle", "announce", "annual", "another", "answer", "antenna", "antique",
  "anxiety", "any", "apart", "apology", "appear", "apple", "approve", "april", "arch", "arctic",
  "area", "arena", "argue", "arm", "armed", "armor", "army", "around", "arrange", "arrest",
  "arrive", "arrow", "art", "artefact", "artist", "artwork", "ask", "aspect", "assault", "asset",
  "assist", "assume", "asthma", "athlete", "atom", "attack", "attend", "attitude", "attract", "auction",
  "audit", "august", "aunt", "author", "auto", "autumn", "average", "avocado", "avoid", "awake",
  "aware", "away", "awesome", "awful", "awkward", "axis", "baby", "bachelor", "bacon", "badge",
  "bag", "balance", "balcony", "ball", "bamboo", "banana", "banner", "bar", "barely", "bargain",
  "barrel", "base", "basic", "basket", "battle", "beach", "bean", "beauty", "because", "become",
  "beef", "before", "begin", "behave", "behind", "believe", "below", "belt", "bench", "benefit",
  "best", "betray", "better", "between", "beyond", "bicycle", "bid", "bike", "bind", "biology",
  "bird", "birth", "bitter", "black", "blade", "blame", "blanket", "blast", "bleak", "bless",
  "blind", "blood", "blossom", "blouse", "blue", "blur", "blush", "board", "boat", "body",
  "boil", "bomb", "bone", "bonus", "book", "boost", "border", "boring", "borrow", "boss",
  "bottom", "bounce", "box", "boy", "bracket", "brain", "brand", "brass", "brave", "bread",
  "breeze", "brick", "bridge", "brief", "bright", "bring", "brisk", "broccoli", "broken", "bronze",
  "broom", "brother", "brown", "brush", "bubble", "buddy", "budget", "buffalo", "build", "bulb",
  "bulk", "bullet", "bundle", "bunker", "burden", "burger", "burst", "bus", "business", "busy",
  "butter", "buyer", "buzz", "cabbage", "cabin", "cable", "cactus", "cage", "cake", "call",
  "calm", "camera", "camp", "can", "canal", "cancel", "candy", "cannon", "canoe", "canvas"
];

const SeedPhraseGenerator: React.FC = () => {
  const { seedPhrase, copyToClipboard, importWallet } = useWallet();
  const [copyAnimation, setCopyAnimation] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [localSeedPhrase, setLocalSeedPhrase] = useState<string[]>([]);
  
  // Generate seed phrase using our custom implementation
  const generateSeedPhrase = () => {
    try {
      setIsGenerating(true);
      console.log("Generating seed phrase locally in SeedPhraseGenerator");
      
      // Generate 12 random words from the wordlist
      const words: string[] = [];
      for (let i = 0; i < 12; i++) {
        const randomIndex = Math.floor(Math.random() * wordlist.length);
        words.push(wordlist[randomIndex]);
      }
      
      console.log("Generated word list (12 words):", words);
      
      // Add a small delay to show loading state
      setTimeout(() => {
        setLocalSeedPhrase(words);
        // Save the generated phrase to the wallet context
        importWallet(words);
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
      // Save the fallback phrase to the wallet context
      importWallet(fallbackPhrase);
      
      toast({
        title: "Error",
        description: "Using fallback seed phrase due to generation error",
        duration: 3000,
      });
    }
  };
  
  // Initialize seed phrase on component mount - check if we already have one in context
  useEffect(() => {
    console.log("SeedPhraseGenerator mounted, checking for existing seed phrase");
    if (seedPhrase && seedPhrase.length >= 12) {
      console.log("Using existing seed phrase from context:", seedPhrase);
      setLocalSeedPhrase(seedPhrase);
    } else {
      console.log("No existing seed phrase found, generating a new one");
      generateSeedPhrase();
    }
  }, []);
  
  const handleCopy = () => {
    if (localSeedPhrase && localSeedPhrase.length >= 12) {
      try {
        const phraseText = localSeedPhrase.join(' ');
        console.log("Copying to clipboard:", phraseText);
        
        // Direct clipboard API to ensure copying works
        navigator.clipboard.writeText(phraseText)
          .then(() => {
            console.log("Successfully copied to clipboard using navigator API");
            setCopyAnimation(true);
            setTimeout(() => setCopyAnimation(false), 1500);
            
            toast({
              title: "Copied!",
              description: "Seed phrase copied to clipboard",
              duration: 2000,
            });
          })
          .catch(err => {
            console.error("Navigator clipboard API failed:", err);
            // Fallback to the context method
            copyToClipboard(phraseText);
          });
      } catch (error) {
        console.error("Copy operation failed:", error);
        toast({
          title: "Error",
          description: "Could not copy seed phrase",
          duration: 2000,
        });
      }
    } else {
      console.error("Cannot copy: localSeedPhrase is invalid", localSeedPhrase);
      toast({
        title: "Error",
        description: "Could not copy seed phrase",
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
