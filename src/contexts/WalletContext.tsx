import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

// Define the type for our context
interface WalletContextType {
  hasWallet: boolean;
  seedPhrase: string[];
  balance: number;
  generateWallet: () => void;
  importWallet: (phrase: string) => void;
  resetWallet: () => void;
}

// Create the context with default values
const WalletContext = createContext<WalletContextType>({
  hasWallet: false,
  seedPhrase: [],
  balance: 0,
  generateWallet: () => {},
  importWallet: () => {},
  resetWallet: () => {},
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

  // Generate a new wallet with a random seed phrase
  const generateWallet = () => {
    // Just setting the seed phrase will trigger the appropriate UI
    // via the seedPhrase length check in Index.tsx
    setSeedPhrase(['word']);
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
  };

  // Effect to update hasWallet when seedPhrase changes
  useEffect(() => {
    // In a real app, we would validate the seed phrase here
    // For this demo, we'll just set hasWallet if there's a seed phrase with 12+ words
    if (seedPhrase.length >= 12) {
      setHasWallet(true);
      // Simulate a balance
      setBalance(Math.random() * 10);
    }
  }, [seedPhrase]);

  return (
    <WalletContext.Provider value={{ 
      hasWallet, 
      seedPhrase, 
      balance,
      generateWallet,
      importWallet,
      resetWallet
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
