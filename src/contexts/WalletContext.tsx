
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

// Define the type for our context
type WalletContextType = {
  seedPhrase: string[];
  walletAddress: string;
  btcBalance: number;
  btcPrice: number;
  usdBalance: number;
  hasWallet: boolean;
  isGenerating: boolean;
  generateWallet: () => void;
  createWallet: () => void;
  copyToClipboard: (text: string) => void;
};

// Create the context with default values
const WalletContext = createContext<WalletContextType>({
  seedPhrase: [],
  walletAddress: '',
  btcBalance: 0,
  btcPrice: 0,
  usdBalance: 0,
  hasWallet: false,
  isGenerating: false,
  generateWallet: () => {},
  createWallet: () => {},
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
  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [btcBalance, setBtcBalance] = useState<number>(0);
  const [btcPrice, setBtcPrice] = useState<number>(85000);
  const [usdBalance, setUsdBalance] = useState<number>(0);
  const [hasWallet, setHasWallet] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Generate new wallet with seed phrase
  const generateWallet = () => {
    setIsGenerating(true);
    
    // Simulate processing delay for realism
    setTimeout(() => {
      const phrase = generateSeedPhrase();
      setSeedPhrase(phrase);
      setIsGenerating(false);
    }, 1000);
  };

  // Create wallet and set up account
  const createWallet = () => {
    if (seedPhrase.length !== 12) {
      toast({
        title: "Error",
        description: "Please generate a valid seed phrase first",
        variant: "destructive"
      });
      return;
    }

    // Set up wallet with default values for demo
    setWalletAddress(generateBtcAddress());
    setBtcBalance(1);
    setUsdBalance(btcPrice);
    setHasWallet(true);

    toast({
      title: "Wallet Created",
      description: "Welcome to your new wallet!",
    });
  };

  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied",
        description: "Copied to clipboard",
      });
    }).catch(() => {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    });
  };

  // Update USD balance when BTC price changes
  useEffect(() => {
    setUsdBalance(btcBalance * btcPrice);
  }, [btcBalance, btcPrice]);

  return (
    <WalletContext.Provider
      value={{
        seedPhrase,
        walletAddress,
        btcBalance,
        btcPrice,
        usdBalance,
        hasWallet,
        isGenerating,
        generateWallet,
        createWallet,
        copyToClipboard,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
