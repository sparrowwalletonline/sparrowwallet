import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import * as bip39 from 'bip39';
import { supabase } from "@/integrations/supabase/client";
import { Session } from '@supabase/supabase-js';

interface WalletContextType {
  hasWallet: boolean;
  seedPhrase: string[];
  balance: number;
  btcBalance: number;
  btcPrice: number;
  usdBalance: number;
  walletAddress: string;
  isGenerating: boolean;
  session: Session | null;
  generateWallet: (stage?: string) => void;
  createWallet: () => void;
  cancelWalletCreation: () => void;
  importWallet: (phrase: string | string[]) => void;
  resetWallet: () => void;
  copyToClipboard: (text: string) => void;
  saveToSupabase: () => Promise<boolean>;
  loadFromSupabase: () => Promise<boolean>;
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

const encryptSeedPhrase = (phrase: string[]): string => {
  try {
    // Very basic encryption - NOT for production use
    return btoa(JSON.stringify(phrase));
  } catch (error) {
    console.error("Error encrypting seed phrase:", error);
    return "";
  }
};

const decryptSeedPhrase = (encryptedPhrase: string): string[] => {
  try {
    // Very basic decryption - NOT for production use
    return JSON.parse(atob(encryptedPhrase));
  } catch (error) {
    console.error("Error decrypting seed phrase:", error);
    return [];
  }
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  useEffect(() => {
    if (seedPhrase && seedPhrase.length >= 12) {
      localStorage.setItem('walletSeedPhrase', JSON.stringify(seedPhrase));
    }
  }, [seedPhrase]);

  const saveToSupabase = async (): Promise<boolean> => {
    if (!session?.user || seedPhrase.length < 12) {
      console.log("Cannot save to Supabase: No user session or invalid seed phrase");
      toast({
        title: "Fehler",
        description: session ? "Ungültige Seed Phrase" : "Du musst angemeldet sein, um zu speichern",
        variant: "destructive",
      });
      return false;
    }

    try {
      const encryptedPhrase = encryptSeedPhrase(seedPhrase);
      
      const { data, error } = await supabase
        .from('wallet_seed_phrases')
        .upsert({
          user_id: session.user.id,
          encrypted_seed_phrase: encryptedPhrase
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error("Error saving seed phrase to Supabase:", error);
        toast({
          title: "Fehler beim Speichern",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      console.log("Seed phrase saved to Supabase successfully");
      toast({
        title: "Erfolgreich gespeichert",
        description: "Deine Seed Phrase wurde in der Cloud gespeichert",
      });
      return true;
    } catch (error) {
      console.error("Exception saving seed phrase to Supabase:", error);
      toast({
        title: "Fehler beim Speichern",
        description: "Ein unerwarteter Fehler ist aufgetreten",
        variant: "destructive",
      });
      return false;
    }
  };

  const loadFromSupabase = async (): Promise<boolean> => {
    if (!session?.user) {
      console.log("Cannot load from Supabase: No user session");
      toast({
        title: "Fehler",
        description: "Du musst angemeldet sein, um deine Seed Phrase zu laden",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('wallet_seed_phrases')
        .select('encrypted_seed_phrase')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        console.error("Error loading seed phrase from Supabase:", error);
        toast({
          title: "Fehler beim Laden",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data && data.encrypted_seed_phrase) {
        const decryptedPhrase = decryptSeedPhrase(data.encrypted_seed_phrase);
        
        if (decryptedPhrase && decryptedPhrase.length >= 12) {
          setSeedPhrase(decryptedPhrase);
          setHasWallet(true);
          const simulatedBtcBalance = 0.01;
          setBtcBalance(simulatedBtcBalance);
          const calculatedUsdBalance = simulatedBtcBalance * btcPrice;
          setUsdBalance(calculatedUsdBalance);
          setWalletAddress(generateBtcAddress());
          setBalance(Math.random() * 10);
          
          toast({
            title: "Erfolgreich geladen",
            description: "Deine Seed Phrase wurde aus der Cloud geladen",
          });
          return true;
        } else {
          console.error("Invalid decrypted seed phrase:", decryptedPhrase);
          toast({
            title: "Fehler beim Laden",
            description: "Die gespeicherte Seed Phrase ist ungültig",
            variant: "destructive",
          });
          return false;
        }
      } else {
        console.log("No seed phrase found in Supabase");
        toast({
          title: "Keine Seed Phrase gefunden",
          description: "Es wurde keine gespeicherte Seed Phrase gefunden",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Exception loading seed phrase from Supabase:", error);
      toast({
        title: "Fehler beim Laden",
        description: "Ein unerwarteter Fehler ist aufgetreten",
        variant: "destructive",
      });
      return false;
    }
  };

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
            localStorage.setItem('walletSeedPhrase', JSON.stringify(newSeedPhrase));
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

  const resetWallet = () => {
    setHasWallet(false);
    setSeedPhrase([]);
    setBalance(0);
    setBtcBalance(0);
    setUsdBalance(0);
    setWalletAddress('');
    localStorage.removeItem('walletSeedPhrase');
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
