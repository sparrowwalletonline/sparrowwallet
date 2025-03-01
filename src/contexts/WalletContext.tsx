import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

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

// BIP39 word list (simplified for demo)
const bip39Words = [
  'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse',
  'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act',
  'action', 'actor', 'actress', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit',
  'adult', 'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent',
  'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol', 'alert',
  'alien', 'all', 'alley', 'allow', 'almost', 'alone', 'alpha', 'already', 'also', 'alter',
  'always', 'amateur', 'amazing', 'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger',
  'angle', 'angry', 'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique',
  'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april', 'arch', 'arctic',
  'area', 'arena', 'argue', 'arm', 'armed', 'armor', 'army', 'around', 'arrange', 'arrest',
  'arrive', 'arrow', 'art', 'artefact', 'artist', 'artwork', 'ask', 'aspect', 'assault', 'asset',
  'assist', 'assume', 'asthma', 'athlete', 'atom', 'attack', 'attend', 'attitude', 'attract', 'auction',
  'audit', 'august', 'aunt', 'author', 'auto', 'autumn', 'average', 'avocado', 'avoid', 'awake'
];

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

// Generate a random seed phrase
const generateSeedPhrase = () => {
  const phrase: string[] = [];
  for (let i = 0; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * bip39Words.length);
    phrase.push(bip39Words[randomIndex]);
  }
  return phrase;
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
    setIsGenerating(true);
    
    // Simulate API delay
    setTimeout(() => {
      const newSeedPhrase = generateSeedPhrase();
      setSeedPhrase(newSeedPhrase);
      setIsGenerating(false);
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
    // In a real app, we would validate the seed phrase here
    // For this demo, we'll just set hasWallet if there's a seed phrase with 12+ words
    if (seedPhrase.length >= 12) {
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
