
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { Session } from '@supabase/supabase-js';

// Import the types and utility functions
import { WalletContextType } from './WalletContextTypes';
import { generateBtcAddress, generateSeedPhrase } from '../utils/walletUtils';
import { copyToClipboard } from '../utils/clipboardUtils';
import { saveWalletToSupabase, loadWalletFromSupabase } from '../utils/supabaseWalletUtils';

const WalletContext = createContext<WalletContextType>({
  hasWallet: false,
  seedPhrase: [],
  balance: 0,
  btcBalance: 0,
  btcPrice: 0,
  usdBalance: 0,
  walletAddress: '',
  isGenerating: false,
  session: null,
  generateWallet: () => {},
  createWallet: () => {},
  cancelWalletCreation: () => {},
  importWallet: () => {},
  resetWallet: () => {},
  copyToClipboard: () => {},
  saveToSupabase: async () => false,
  loadFromSupabase: async () => false,
});

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state variables
  const savedSeedPhrase = localStorage.getItem('walletSeedPhrase');
  const initialSeedPhrase = savedSeedPhrase ? JSON.parse(savedSeedPhrase) : [];
  
  const [hasWallet, setHasWallet] = useState(initialSeedPhrase.length >= 12);
  const [seedPhrase, setSeedPhrase] = useState<string[]>(initialSeedPhrase);
  const [balance, setBalance] = useState(0);
  const [btcBalance, setBtcBalance] = useState(0);
  const [btcPrice, setBtcPrice] = useState(40000);
  const [usdBalance, setUsdBalance] = useState(0);
  const [walletAddress, setWalletAddress] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  // Initialize session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Save seed phrase to local storage when it changes
  useEffect(() => {
    if (seedPhrase && seedPhrase.length >= 12) {
      localStorage.setItem('walletSeedPhrase', JSON.stringify(seedPhrase));
    }
  }, [seedPhrase]);

  // Save wallet to Supabase
  const saveToSupabase = async (): Promise<boolean> => {
    return await saveWalletToSupabase(session, seedPhrase);
  };

  // Load wallet from Supabase
  const loadFromSupabase = async (): Promise<boolean> => {
    const loadedSeedPhrase = await loadWalletFromSupabase(
      session, 
      setBtcBalance, 
      setUsdBalance, 
      setWalletAddress, 
      setBalance, 
      btcPrice
    );
    
    if (loadedSeedPhrase) {
      setSeedPhrase(loadedSeedPhrase);
      setHasWallet(true);
      return true;
    }
    
    return false;
  };

  // Generate wallet in specific stage
  const generateWallet = (stage?: string) => {
    if (stage === 'passphrase') {
      setSeedPhrase(['word', 'word']);
    } else {
      setSeedPhrase(['word']);
    }
  };

  // Create a new wallet
  const createWallet = () => {
    console.log("createWallet function called - starting generation");
    setIsGenerating(true);
    
    setTimeout(() => {
      try {
        // Only generate a new seed phrase if we don't already have one
        if (!seedPhrase || seedPhrase.length < 12) {
          const newSeedPhrase = generateSeedPhrase();
          if (newSeedPhrase && newSeedPhrase.length >= 12) {
            setSeedPhrase([...newSeedPhrase]);
            localStorage.setItem('walletSeedPhrase', JSON.stringify(newSeedPhrase));
            console.log("Seed phrase set:", newSeedPhrase.join(' '));
            setHasWallet(true);
            const simulatedBtcBalance = 0.01;
            setBtcBalance(simulatedBtcBalance);
            const calculatedUsdBalance = simulatedBtcBalance * btcPrice;
            setUsdBalance(calculatedUsdBalance);
            setWalletAddress(generateBtcAddress());
            setBalance(Math.random() * 10);
          } else {
            console.error("Generated seed phrase is invalid:", newSeedPhrase);
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

  // Cancel wallet creation
  const cancelWalletCreation = () => {
    console.log("Cancelled wallet creation but keeping seed phrase:", seedPhrase.join(' '));
  };

  // Import wallet from seed phrase
  const importWallet = (phrase: string | string[]) => {
    if (phrase) {
      const words = typeof phrase === 'string' ? phrase.split(' ') : phrase;
      console.log("Importing wallet with phrase:", words.join(' '));
      
      // Only set if it's a new phrase or we don't have one yet
      if (!seedPhrase || seedPhrase.length < 12 || (words.join(' ') !== seedPhrase.join(' '))) {
        console.log("Setting new seed phrase in importWallet");
        setSeedPhrase(words);
        localStorage.setItem('walletSeedPhrase', JSON.stringify(words));
        
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

  // Reset wallet
  const resetWallet = () => {
    setHasWallet(false);
    setSeedPhrase([]);
    setBalance(0);
    setBtcBalance(0);
    setUsdBalance(0);
    setWalletAddress('');
    localStorage.removeItem('walletSeedPhrase');
  };

  // Log when seed phrase changes
  useEffect(() => {
    console.log("Seed phrase updated:", seedPhrase ? seedPhrase.join(' ') : 'undefined');
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
      session,
      generateWallet,
      createWallet,
      cancelWalletCreation,
      importWallet,
      resetWallet,
      copyToClipboard,
      saveToSupabase,
      loadFromSupabase
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
