import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Copy, RefreshCw, CloudUpload, CloudDownload } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { toast } from '@/hooks/use-toast';

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
        
        // CRITICAL FIX: Update the wallet context with the new seed phrase
        importWallet(words);
        console.log("Updated wallet context with new seed phrase");
        
        // Save to localStorage as a fallback
        localStorage.setItem('walletSeedPhrase', JSON.stringify(words));
        
        setIsGenerating(false);
        
        toast({
          title: "Success",
          description: "Seed phrase generated successfully",
          duration: 3000,
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
    
    // CRITICAL FIX: Only set localSeedPhrase from context if it exists, but don't auto-generate
    if (seedPhrase && seedPhrase.length >= 12) {
      console.log("Using existing seed phrase from context:", seedPhrase);
      setLocalSeedPhrase(seedPhrase);
    } else {
      // Check localStorage as fallback
      const savedPhrase = localStorage.getItem('walletSeedPhrase');
      if (savedPhrase) {
        try {
          const parsedPhrase = JSON.parse(savedPhrase);
          if (Array.isArray(parsedPhrase) && parsedPhrase.length >= 12) {
            console.log("Using seed phrase from localStorage");
            setLocalSeedPhrase(parsedPhrase);
            // Update the wallet context
            importWallet(parsedPhrase);
          }
        } catch (error) {
          console.error("Error parsing seed phrase from localStorage:", error);
        }
      }
    }
    // Don't auto-generate a new seed phrase
  }, [seedPhrase, importWallet]); 
  
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
              duration: 3000,
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
          duration: 3000,
        });
      }
    } else {
      console.error("Cannot copy: localSeedPhrase is invalid", localSeedPhrase);
      toast({
        title: "Error",
        description: "Could not copy seed phrase",
        duration: 3000,
      });
    }
  };

  const handleGenerateWallet = () => {
    console.log("Generate button clicked - generating new seed phrase locally");
    generateSeedPhrase();
  };

  const handleSaveToSupabase = async () => {
    if (!session) {
      toast({
        title: "Not logged in",
        description: "You must be logged in to save your seed phrase",
        duration: 3000,
      });
      return;
    }

    if (!localSeedPhrase || localSeedPhrase.length < 12) {
      toast({
        title: "Error",
        description: "There is no valid seed phrase to save",
        duration: 3000,
      });
      return;
    }

    setIsSaving(true);
    try {
      // CRITICAL FIX: Ensure we're using the correct seed phrase for saving
      // First update the wallet context if needed
      if (JSON.stringify(seedPhrase) !== JSON.stringify(localSeedPhrase)) {
        importWallet(localSeedPhrase);
      }
      
      await saveToSupabase();
      toast({
        title: "Saved",
        description: "Seed phrase has been successfully saved",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error saving to Supabase:", error);
      toast({
        title: "Error",
        description: "Seed phrase could not be saved",
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
        title: "Not logged in",
        description: "You must be logged in to load your seed phrase",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await loadFromSupabase();
      if (success) {
        // Update local state with the loaded seed phrase
        setLocalSeedPhrase(seedPhrase);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("SeedPhraseGenerator rendered with local seedPhrase:", 
      localSeedPhrase ? localSeedPhrase.join(' ') : 'undefined');
  }, [localSeedPhrase]);

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
            {isGenerating ? 'Generating seed phrase...' : 'No seed phrase generated. Click "Generate New" below.'}
          </div>
        )}
      </Card>
      
      <div className="flex gap-3 flex-wrap">
        <Button 
          onClick={handleGenerateWallet} 
          variant="outline" 
          className="flex-1 h-12 bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"
          disabled={isGenerating || isSaving || isLoading}
        >
          <RefreshCw 
            className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} 
          />
          Generate New
        </Button>
        
        <Button 
          onClick={handleCopy}
          variant="outline" 
          className="flex-1 h-12 bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"
          disabled={!localSeedPhrase || localSeedPhrase.length < 12 || isGenerating || isSaving || isLoading}
        >
          <Copy className={`h-4 w-4 mr-2 ${copyAnimation ? 'text-green-500' : ''}`} />
          Copy
        </Button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Button 
          onClick={handleSaveToSupabase}
          variant="outline" 
          className="flex-1 h-12 bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"
          disabled={!localSeedPhrase || localSeedPhrase.length < 12 || isGenerating || isSaving || isLoading || !session}
        >
          <CloudUpload className={`h-4 w-4 mr-2 ${isSaving ? 'animate-pulse' : ''}`} />
          {isSaving ? 'Saving...' : 'Save to Cloud'}
        </Button>
        
        <Button 
          onClick={handleLoadFromSupabase}
          variant="outline" 
          className="flex-1 h-12 bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"
          disabled={isGenerating || isSaving || isLoading || !session}
        >
          <CloudDownload className={`h-4 w-4 mr-2 ${isLoading ? 'animate-pulse' : ''}`} />
          {isLoading ? 'Loading...' : 'Load from Cloud'}
        </Button>
      </div>
    </div>
  );
};

export default SeedPhraseGenerator;
