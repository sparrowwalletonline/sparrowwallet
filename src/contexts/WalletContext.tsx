import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import * as bip39 from 'bip39';

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
  importWallet: (phrase: string | string[]) => void;
  resetWallet: () => void;
  copyToClipboard: (text: string) => void;
}

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

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateBtcAddress = () => {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let address = getRandomInt(0, 1) === 0 ? 'bc1' : '1';
  
  const length = address.startsWith('bc1') ? 39 : 33;
  for (let i = address.length; i < length; i++) {
    address += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return address;
};

const generateSeedPhrase = (): string[] => {
  try {
    const mnemonic = bip39.generateMnemonic(128);
    console.log("Generated BIP39 mnemonic in WalletContext:", mnemonic);
    const words = mnemonic.split(' ');
    console.log("BIP39 word list in WalletContext (should be 12 words):", words);
    return words;
  } catch (error) {
    console.error("Error generating seed phrase in WalletContext:", error);
    return ["ability", "dinner", "canvas", "trash", "paper", "volcano", "energy", "horse", "author", "basket", "melody", "vintage"];
  }
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasWallet, setHasWallet] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);
  const [balance, setBalance] = useState(0);
  const [btcBalance, setBtcBalance] = useState(0);
  const [btcPrice, setBtcPrice] = useState(40000);
  const [usdBalance, setUsdBalance] = useState(0);
  const [walletAddress, setWalletAddress] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateWallet = (stage?: string) => {
    if (stage === 'passphrase') {
      setSeedPhrase(['word', 'word']);
    } else {
      setSeedPhrase(['word']);
    }
  };

  const createWallet = () => {
    console.log("createWallet function called in WalletContext - starting generation");
    setIsGenerating(true);
    
    setTimeout(() => {
      try {
        // Only generate a new seed phrase if we don't already have one
        if (!seedPhrase || seedPhrase.length < 12) {
          const newSeedPhrase = generateSeedPhrase();
          if (newSeedPhrase && newSeedPhrase.length >= 12) {
            setSeedPhrase([...newSeedPhrase]);
            console.log("Seed phrase set in WalletContext:", newSeedPhrase.join(' '));
            setHasWallet(true);
            const simulatedBtcBalance = 0.01;
            setBtcBalance(simulatedBtcBalance);
            const calculatedUsdBalance = simulatedBtcBalance * btcPrice;
            setUsdBalance(calculatedUsdBalance);
            setWalletAddress(generateBtcAddress());
            setBalance(Math.random() * 10);
          } else {
            console.error("Generated seed phrase is invalid in WalletContext:", newSeedPhrase);
          }
        } else {
          console.log("Using existing seed phrase in createWallet:", seedPhrase.join(' '));
          setHasWallet(true);
        }
      } catch (error) {
        console.error("Error in createWallet:", error);
      } finally {
        setIsGenerating(false);
      }
    }, 500);
  };

  const cancelWalletCreation = () => {
    // Don't clear the seed phrase anymore, just leave the flow
    console.log("Cancelled wallet creation but keeping seed phrase:", seedPhrase.join(' '));
  };

  const importWallet = (phrase: string | string[]) => {
    if (phrase) {
      const words = typeof phrase === 'string' ? phrase.split(' ') : phrase;
      console.log("Importing wallet with phrase:", words.join(' '));
      
      // Only set if it's a new phrase or we don't have one yet
      if (!seedPhrase || seedPhrase.length < 12 || (words.join(' ') !== seedPhrase.join(' '))) {
        console.log("Setting new seed phrase in importWallet");
        setSeedPhrase(words);
        
        if (words.length >= 12) {
          setHasWallet(true);
          const simulatedBtcBalance = 0.01;
          setBtcBalance(simulatedBtcBalance);
          const calculatedUsdBalance = simulatedBtcBalance * btcPrice;
          setUsdBalance(calculatedUsdBalance);
          setWalletAddress(generateBtcAddress());
          setBalance(Math.random() * 10);
        }
      } else {
        console.log("Seed phrase already exists and matches, no change needed");
      }
    }
  };

  const resetWallet = () => {
    setHasWallet(false);
    setSeedPhrase([]);
    setBalance(0);
    setBtcBalance(0);
    setUsdBalance(0);
    setWalletAddress('');
  };

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

  useEffect(() => {
    console.log("Seed phrase updated in WalletContext:", seedPhrase ? seedPhrase.join(' ') : 'undefined');
    console.log("Seed phrase length:", seedPhrase.length);
    
    if (seedPhrase && seedPhrase.length >= 12) {
      console.log("Valid seed phrase detected, setting hasWallet to true");
      setHasWallet(true);
    }
  }, [seedPhrase]);

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
