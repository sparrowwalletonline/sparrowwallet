
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import * as bip39 from 'bip39';

// Define the type for our context
interface WalletContextType {
  hasWallet: boolean;
  seedPhrase: string[];
  balance: number;
  btcBalance: number;
  btcPrice: number;
  usdBalance: number;
  walletAddress: string;
  isGenerating: boolean;
  generateWallet: (stage?: string) => void;
  createWallet: () => void;
  cancelWalletCreation: () => void;
  importWallet: (phrase: string) => void;
  resetWallet: () => void;
  copyToClipboard: (text: string) => void;
}

// Create the context with default values
const WalletContext = createContext<WalletContextType>({
  hasWallet: false,
  seedPhrase: [],
  balance: 0,
  btcBalance: 0,
  btcPrice: 0,
  usdBalance: 0,
  walletAddress: '',
  isGenerating: false,
  generateWallet: () => {},
  createWallet: () => {},
  cancelWalletCreation: () => {},
  importWallet: () => {},
  resetWallet: () => {},
  copyToClipboard: () => {},
});

// Helper to generate random number in range
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a random BTC address (not real)
const generateBtcAddress = () => {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let address = getRandomInt(0, 1) === 0 ? 'bc1' : '1';
  
  // Add random characters
  const length = address.startsWith('bc1') ? 39 : 33;
  for (let i = address.length; i < length; i++) {
    address += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return address;
};

// Generate a BIP39 seed phrase
const generateSeedPhrase = (): string[] => {
  try {
    // Generate a random mnemonic (128-256 bits)
    const mnemonic = bip39.generateMnemonic(128); // 128 bits = 12 words
    console.log("Generated BIP39 mnemonic in WalletContext:", mnemonic);
    
    // For debugging, log the words
    const words = mnemonic.split(' ');
    console.log("BIP39 word list in WalletContext (should be 12 words):", words);
    
    return words;
  } catch (error) {
    console.error("Error generating seed phrase in WalletContext:", error);
    
    // Fallback to a hardcoded seed phrase for testing
    return ["ability", "dinner", "canvas", "trash", "paper", "volcano", "energy", "horse", "author", "basket", "melody", "vintage"];
  }
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasWallet, setHasWallet] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);
  const [balance, setBalance] = useState(0);
  const [btcBalance, setBtcBalance] = useState(0);
  const [btcPrice, setBtcPrice] = useState(40000); // Default BTC price in USD
  const [usdBalance, setUsdBalance] = useState(0);
  const [walletAddress, setWalletAddress] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate a new wallet with a random seed phrase
  const generateWallet = (stage?: string) => {
    // Just setting the seed phrase will trigger the appropriate UI
    // If stage is 'passphrase', we're going to the PassPhrase page
    if (stage === 'passphrase') {
      setSeedPhrase(['word', 'word']); // Two words indicate PassPhrase page
    } else {
      setSeedPhrase(['word']); // One word indicates WalletChoice page
    }
  };

  // Actually create the wallet with a full seed phrase
  const createWallet = () => {
    console.log("createWallet function called in WalletContext - starting generation");
    setIsGenerating(true);
    
    // Generate the seed phrase
    setTimeout(() => {
      try {
        // Generate the new seed phrase using BIP39
        const newSeedPhrase = generateSeedPhrase();
        
        // Only set the seed phrase after we've confirmed it was generated
        if (newSeedPhrase && newSeedPhrase.length >= 12) {
          // Create a new array reference to ensure React re-renders
          setSeedPhrase([...newSeedPhrase]); 
          console.log("Seed phrase set in WalletContext:", newSeedPhrase.join(' '));
        } else {
          console.error("Generated seed phrase is invalid in WalletContext:", newSeedPhrase);
        }
      } catch (error) {
        console.error("Error in createWallet:", error);
      } finally {
        setIsGenerating(false);
      }
    }, 500);
  };

  // Cancel wallet creation process
  const cancelWalletCreation = () => {
    setSeedPhrase([]);
  };

  // Import an existing wallet using a provided seed phrase
  const importWallet = (phrase: string) => {
    if (phrase) {
      // Split the phrase into words if it's a string
      const words = typeof phrase === 'string' ? phrase.split(' ') : phrase;
      setSeedPhrase(words);
    }
  };

  // Reset wallet state
  const resetWallet = () => {
    setHasWallet(false);
    setSeedPhrase([]);
    setBalance(0);
    setBtcBalance(0);
    setUsdBalance(0);
    setWalletAddress('');
  };

  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        console.log("Text copied to clipboard successfully:", text);
        toast({
          title: "Copied to clipboard",
          description: "The text has been copied to your clipboard.",
          duration: 2000,
        });
      },
      (err) => {
        console.error('Could not copy text: ', err);
        toast({
          title: "Failed to copy",
          description: "Could not copy text to clipboard.",
          variant: "destructive",
          duration: 2000,
        });
      }
    );
  };

  // Effect to update hasWallet when seedPhrase changes
  useEffect(() => {
    console.log("Seed phrase updated in WalletContext:", seedPhrase ? seedPhrase.join(' ') : 'undefined');
    
    // In a real app, we would validate the seed phrase here
    // For this demo, we'll just set hasWallet if there's a seed phrase with 12+ words
    if (seedPhrase && seedPhrase.length >= 12) {
      setHasWallet(true);
      
      // Simulate values
      const simulatedBtcBalance = 0.01;
      setBtcBalance(simulatedBtcBalance);
      
      // Calculate USD value
      const calculatedUsdBalance = simulatedBtcBalance * btcPrice;
      setUsdBalance(calculatedUsdBalance);
      
      // Generate a wallet address
      setWalletAddress(generateBtcAddress());
      
      // Simulate a balance
      setBalance(Math.random() * 10);
    }
  }, [seedPhrase, btcPrice]);

  return (
    <WalletContext.Provider value={{ 
      hasWallet, 
      seedPhrase, 
      balance,
      btcBalance,
      btcPrice,
      usdBalance,
      walletAddress,
      isGenerating,
      generateWallet,
      createWallet,
      cancelWalletCreation,
      importWallet,
      resetWallet,
      copyToClipboard
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
