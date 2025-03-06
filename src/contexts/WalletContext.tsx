import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { Session } from '@supabase/supabase-js';

// Import the types and utility functions
import { WalletContextType, Wallet } from './WalletContextTypes';
import { generateBtcAddress, generateSeedPhrase } from '../utils/walletUtils';
import { copyToClipboard } from '../utils/clipboardUtils';
import { saveWalletToSupabase, loadWalletFromSupabase } from '../utils/supabaseWalletUtils';
import { fetchCryptoPrices, CryptoPrice, fallbackCryptoData } from '../utils/cryptoPriceUtils';

const WalletContext = createContext<WalletContextType>({
  hasWallet: false,
  seedPhrase: [],
  balance: 0,
  btcBalance: 0,
  btcPrice: 0,
  ethBalance: 0,
  ethPrice: 0,
  usdBalance: 0,
  walletAddress: '',
  isGenerating: false,
  session: null,
  isRefreshingPrices: false,
  cryptoPrices: fallbackCryptoData,
  wallets: [],
  activeWallet: null,
  enabledCryptos: ['bitcoin', 'ethereum', 'binancecoin', 'matic-network'],
  refreshPrices: async () => fallbackCryptoData,
  generateWallet: () => {},
  createWallet: () => {},
  cancelWalletCreation: () => {},
  importWallet: () => {},
  resetWallet: () => {},
  copyToClipboard: () => {},
  saveToSupabase: async () => false,
  loadFromSupabase: async () => false,
  addNewWallet: () => {},
  setActiveWallet: () => {},
  updateEnabledCryptos: () => {},
  deleteWallet: () => {},
  saveWalletAddressToUserAccount: async () => false,
  loadWalletFromUserAccount: async () => false,
  logout: async () => {},
  pinProtectionEnabled: false,
  requirePinVerification: false,
  setRequirePinVerification: () => {},
  verifyPin: () => false,
  setPinProtectionEnabled: () => {},
  setPin: () => {},
  pinVerified: false,
  setPinVerified: () => {},
  refreshWalletBalance: async () => false
});

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const savedSeedPhrase = localStorage.getItem('walletSeedPhrase');
  const initialSeedPhrase = savedSeedPhrase ? JSON.parse(savedSeedPhrase) : [];
  
  const [hasWallet, setHasWallet] = useState(initialSeedPhrase.length >= 12);
  const [seedPhrase, setSeedPhrase] = useState<string[]>(initialSeedPhrase);
  const [balance, setBalance] = useState(0);
  const [btcBalance, setBtcBalance] = useState(0);
  const [btcPrice, setBtcPrice] = useState(40000);
  const [ethBalance, setEthBalance] = useState(0);
  const [ethPrice, setEthPrice] = useState(2000);
  const [usdBalance, setUsdBalance] = useState(0);
  const [walletAddress, setWalletAddress] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isRefreshingPrices, setIsRefreshingPrices] = useState(false);
  const [cryptoPrices, setCryptoPrices] = useState<Record<string, CryptoPrice>>(fallbackCryptoData);
  
  const [pin, setPin] = useState<string>(() => {
    return localStorage.getItem('walletPin') || '';
  });
  const [pinProtectionEnabled, setPinProtectionEnabled] = useState<boolean>(() => {
    return localStorage.getItem('pinProtectionEnabled') === 'true';
  });
  const [requirePinVerification, setRequirePinVerification] = useState<boolean>(false);
  const [pinVerified, setPinVerified] = useState<boolean>(false);
  
  const [enabledCryptos, setEnabledCryptos] = useState<string[]>(() => {
    const savedEnabledCryptos = localStorage.getItem('enabledCryptos');
    return savedEnabledCryptos 
      ? JSON.parse(savedEnabledCryptos) 
      : ['bitcoin', 'ethereum', 'binancecoin', 'matic-network'];
  });

  const [wallets, setWallets] = useState<Wallet[]>(() => {
    const savedWallets = localStorage.getItem('wallets');
    if (savedWallets) {
      const parsedWallets = JSON.parse(savedWallets);
      if (parsedWallets.length > 0 && !parsedWallets.some(w => w.isActive)) {
        parsedWallets[0].isActive = true;
      }
      return parsedWallets;
    }
    
    if (initialSeedPhrase.length >= 12) {
      const defaultWallet: Wallet = {
        id: '1',
        name: 'Main Wallet',
        seedPhrase: initialSeedPhrase,
        walletAddress: localStorage.getItem('walletAddress') || generateBtcAddress(),
        btcBalance: 0,
        ethBalance: 0,
        isActive: true
      };
      return [defaultWallet];
    }
    
    return [];
  });

  const [activeWallet, setActiveWalletState] = useState<Wallet | null>(() => {
    const active = wallets.find(w => w.isActive);
    return active || (wallets.length > 0 ? wallets[0] : null);
  });

  useEffect(() => {
    if (pinProtectionEnabled && pin) {
      localStorage.setItem('walletPin', pin);
      localStorage.setItem('pinProtectionEnabled', 'true');
    } else if (!pinProtectionEnabled) {
      localStorage.setItem('pinProtectionEnabled', 'false');
    }
  }, [pinProtectionEnabled, pin]);

  useEffect(() => {
    const checkForReturningSessions = () => {
      if (pinProtectionEnabled && session && !pinVerified && pin) {
        const lastActivity = localStorage.getItem('lastActivity');
        if (!lastActivity || (Date.now() - parseInt(lastActivity)) > 30 * 60 * 1000) {
          setRequirePinVerification(true);
        }
      }
    };

    checkForReturningSessions();
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkForReturningSessions();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [session, pinProtectionEnabled, pinVerified, pin]);

  useEffect(() => {
    const updateActivity = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
    };
    
    updateActivity();
    
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    activityEvents.forEach(event => {
      window.addEventListener(event, updateActivity);
    });
    
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, []);

  useEffect(() => {
    if (wallets.length > 0) {
      if (!wallets.some(w => w.isActive)) {
        const updatedWallets = [...wallets];
        updatedWallets[0].isActive = true;
        setWallets(updatedWallets);
        setActiveWalletState(updatedWallets[0]);
      }
      localStorage.setItem('wallets', JSON.stringify(wallets));
    }
  }, [wallets]);

  useEffect(() => {
    localStorage.setItem('enabledCryptos', JSON.stringify(enabledCryptos));
  }, [enabledCryptos]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadWalletFromUserAccount();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        loadWalletFromUserAccount();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    refreshPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (Object.keys(cryptoPrices).length > 0) {
      if (cryptoPrices.BTC) {
        setBtcPrice(cryptoPrices.BTC.price);
      }
      if (cryptoPrices.ETH) {
        setEthPrice(cryptoPrices.ETH.price);
      }
      
      const calculatedUsdBalance = (btcBalance * (cryptoPrices.BTC?.price || btcPrice)) + 
                                  (ethBalance * (cryptoPrices.ETH?.price || ethPrice));
      setUsdBalance(calculatedUsdBalance);
    }
  }, [cryptoPrices, btcBalance, ethBalance]);

  useEffect(() => {
    if (seedPhrase && seedPhrase.length >= 12) {
      localStorage.setItem('walletSeedPhrase', JSON.stringify(seedPhrase));
    }
  }, [seedPhrase]);

  const verifyPin = (inputPin: string): boolean => {
    if (pin && inputPin === pin) {
      setPinVerified(true);
      setRequirePinVerification(false);
      return true;
    }
    return false;
  };

  const saveWalletAddressToUserAccount = async (): Promise<boolean> => {
    if (!session?.user) {
      console.log('No user logged in to save wallet data');
      return false;
    }
    
    if (!walletAddress) {
      console.log('No wallet address available to save');
      return false;
    }

    try {
      console.log('Attempting to save wallet data to user account:', {
        user_id: session.user.id,
        wallet_address: walletAddress,
        btc_balance: btcBalance,
        eth_balance: ethBalance
      });

      const { data: existingWallet, error: checkError } = await supabase
        .from('user_wallets')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing wallet:', checkError);
        toast({
          title: "Fehler",
          description: "Wallet-Daten konnten nicht überprüft werden: " + checkError.message,
          variant: "destructive",
        });
        return false;
      }

      let result;
      if (existingWallet) {
        console.log('Updating existing wallet for user:', session.user.id);
        result = await supabase
          .from('user_wallets')
          .update({
            wallet_address: walletAddress,
            btc_balance: btcBalance,
            eth_balance: ethBalance
          })
          .eq('user_id', session.user.id);
      } else {
        console.log('Creating new wallet for user:', session.user.id);
        result = await supabase
          .from('user_wallets')
          .insert({
            user_id: session.user.id,
            wallet_address: walletAddress,
            btc_balance: btcBalance,
            eth_balance: ethBalance
          });
      }

      if (result.error) {
        console.error('Error saving wallet data:', result.error);
        toast({
          title: "Fehler beim Speichern der Wallet",
          description: result.error.message || "Ein unerwarteter Fehler ist aufgetreten",
          variant: "destructive",
        });
        return false;
      }

      console.log('Wallet data saved successfully');
      toast({
        title: "Erfolg",
        description: "Wallet-Daten erfolgreich gespeichert",
      });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ein unerwarteter Fehler ist aufgetreten';
      console.error('Unexpected error saving wallet data:', error);
      toast({
        title: "Fehler beim Speichern der Wallet",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  const loadWalletFromUserAccount = async (): Promise<boolean> => {
    if (!session?.user) {
      console.log('No user logged in for loading wallet data');
      return false;
    }

    try {
      console.log('Attempting to load wallet data for user:', session.user.id);
      
      const { data, error } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading wallet data:', error);
        toast({
          title: "Fehler beim Laden der Wallet",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data) {
        console.log('Wallet data loaded successfully:', data);
        setWalletAddress(data.wallet_address);
        setBtcBalance(Number(data.btc_balance));
        setEthBalance(Number(data.eth_balance));
        
        if (activeWallet) {
          const updatedWallets = wallets.map(wallet => {
            if (wallet.isActive) {
              return {
                ...wallet,
                walletAddress: data.wallet_address,
                btcBalance: Number(data.btc_balance),
                ethBalance: Number(data.eth_balance)
              };
            }
            return wallet;
          });
          setWallets(updatedWallets);
          
          const newActiveWallet = updatedWallets.find(w => w.isActive);
          if (newActiveWallet) {
            setActiveWalletState(newActiveWallet);
          }
        }
        
        const calculatedUsdBalance = (Number(data.btc_balance) * btcPrice) + 
                                  (Number(data.eth_balance) * ethPrice);
        setUsdBalance(calculatedUsdBalance);
        
        return true;
      }
      
      console.log('No wallet data found for user');
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ein unerwarteter Fehler ist aufgetreten';
      console.error('Unexpected error loading wallet data:', error);
      toast({
        title: "Fehler beim Laden der Wallet",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  const refreshPrices = async () => {
    setIsRefreshingPrices(true);
    try {
      const prices = await fetchCryptoPrices();
      setCryptoPrices(prices);
      return prices;
    } catch (error) {
      console.error("Error refreshing prices:", error);
      return fallbackCryptoData;
    } finally {
      setIsRefreshingPrices(false);
    }
  };

  const updateEnabledCryptos = (cryptoIds: string[]) => {
    setEnabledCryptos(cryptoIds);
  };

  const saveToSupabase = async (): Promise<boolean> => {
    const seedPhraseSaved = await saveWalletToSupabase(session, seedPhrase);
    
    if (seedPhraseSaved && walletAddress) {
      const walletSaved = await saveWalletAddressToUserAccount();
      return seedPhraseSaved && walletSaved;
    }
    
    return seedPhraseSaved;
  };

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
      
      await loadWalletFromUserAccount();
      
      return true;
    }
    
    return false;
  };

  const refreshWalletBalance = async (): Promise<boolean> => {
    if (!session?.user) {
      console.log('No user logged in to refresh wallet balance');
      return false;
    }

    try {
      console.log('Refreshing wallet balance from Supabase for user:', session.user.id);
      
      const { data, error } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error refreshing wallet balance:', error);
        toast({
          title: "Fehler beim Aktualisieren der Wallet",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data) {
        console.log('Wallet balance refreshed successfully:', data);
        
        // Update local state with refreshed data
        setBtcBalance(Number(data.btc_balance));
        setEthBalance(Number(data.eth_balance));
        setWalletAddress(data.wallet_address);
        
        const calculatedUsdBalance = (Number(data.btc_balance) * btcPrice) + 
                                   (Number(data.eth_balance) * ethPrice);
        setUsdBalance(calculatedUsdBalance);
        
        // Also update the active wallet
        if (activeWallet) {
          const updatedWallets = wallets.map(wallet => {
            if (wallet.isActive) {
              return {
                ...wallet,
                walletAddress: data.wallet_address,
                btcBalance: Number(data.btc_balance),
                ethBalance: Number(data.eth_balance)
              };
            }
            return wallet;
          });
          
          setWallets(updatedWallets);
          
          const newActiveWallet = updatedWallets.find(w => w.isActive);
          if (newActiveWallet) {
            setActiveWalletState(newActiveWallet);
          }
        }
        
        toast({
          title: "Wallet aktualisiert",
          description: "Wallet-Daten wurden erfolgreich aktualisiert",
        });
        
        return true;
      }
      
      console.log('No wallet data found during refresh');
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ein unerwarteter Fehler ist aufgetreten';
      console.error('Unexpected error refreshing wallet balance:', error);
      toast({
        title: "Fehler beim Aktualisieren der Wallet",
        description: errorMessage,
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

  const addNewWallet = (name: string) => {
    const newWalletId = `wallet-${Date.now()}`;
    const newSeedPhrase = generateSeedPhrase();
    const newAddress = generateBtcAddress();
    
    const newWallet: Wallet = {
      id: newWalletId,
      name: name,
      seedPhrase: newSeedPhrase,
      walletAddress: newAddress,
      btcBalance: 0,
      ethBalance: 0,
      isActive: false
    };
    
    setWallets(prev => [...prev, newWallet]);
    
    toast({
      title: "Wallet hinzugefügt",
      description: `${name} wurde erfolgreich erstellt.`,
    });
    
    if (session && wallets.length === 0) {
      setWalletAddress(newAddress);
      saveWalletAddressToUserAccount();
    }
  };

  const setActiveWallet = (walletId: string) => {
    setWallets(prev => 
      prev.map(wallet => ({
        ...wallet,
        isActive: wallet.id === walletId
      }))
    );
    
    const newActiveWallet = wallets.find(w => w.id === walletId) || null;
    setActiveWalletState(newActiveWallet);
    
    if (newActiveWallet) {
      setSeedPhrase(newActiveWallet.seedPhrase);
      setWalletAddress(newActiveWallet.walletAddress);
      setBtcBalance(newActiveWallet.btcBalance);
      setEthBalance(newActiveWallet.ethBalance);
      
      const calculatedUsdBalance = (newActiveWallet.btcBalance * btcPrice) + 
                                  (newActiveWallet.ethBalance * ethPrice);
      setUsdBalance(calculatedUsdBalance);
      
      toast({
        title: "Wallet gewechselt",
        description: `${newActiveWallet.name} ist jetzt aktiv.`,
      });
      
      if (session) {
        saveWalletAddressToUserAccount();
      }
    }
  };

  const createWallet = () => {
    console.log("createWallet function called - starting generation");
    setIsGenerating(true);
    
    setTimeout(() => {
      try {
        if (!seedPhrase || seedPhrase.length < 12) {
          const newSeedPhrase = generateSeedPhrase();
          if (newSeedPhrase && newSeedPhrase.length >= 12) {
            setSeedPhrase([...newSeedPhrase]);
            localStorage.setItem('walletSeedPhrase', JSON.stringify(newSeedPhrase));
            console.log("Seed phrase set:", newSeedPhrase.join(' '));
            setHasWallet(true);
            const simulatedBtcBalance = 0;
            setBtcBalance(simulatedBtcBalance);
            setEthBalance(0);
            const calculatedUsdBalance = (simulatedBtcBalance * btcPrice) + (0 * ethPrice);
            setUsdBalance(calculatedUsdBalance);
            const newAddress = generateBtcAddress();
            setWalletAddress(newAddress);
            setBalance(0);
            
            if (wallets.length === 0) {
              const defaultWallet: Wallet = {
                id: '1',
                name: 'Main Wallet',
                seedPhrase: newSeedPhrase,
                walletAddress: newAddress,
                btcBalance: simulatedBtcBalance,
                ethBalance: 0,
                isActive: true
              };
              setWallets([defaultWallet]);
              setActiveWalletState(defaultWallet);
            }
            
            if (session) {
              setTimeout(() => {
                saveWalletAddressToUserAccount();
              }, 500);
            }
          } else {
            console.error("Generated seed phrase is invalid:", newSeedPhrase);
          }
        } else {
          console.log("Using existing seed phrase in createWallet:", seedPhrase.join(' '));
          setHasWallet(true);
          
          if (session && walletAddress) {
            saveWalletAddressToUserAccount();
          }
        }
      } catch (error) {
        console.error("Error in createWallet:", error);
      } finally {
        setIsGenerating(false);
      }
    }, 500);
  };

  const cancelWalletCreation = () => {
    console.log("Cancelled wallet creation but keeping seed phrase:", seedPhrase.join(' '));
  };

  const importWallet = (phrase: string | string[]) => {
    if (phrase) {
      const words = typeof phrase === 'string' ? phrase.split(' ') : phrase;
      console.log("Importing wallet with phrase:", words.join(' '));
      
      if (!seedPhrase || seedPhrase.length < 12 || (words.join(' ') !== seedPhrase.join(' '))) {
        console.log("Setting new seed phrase in importWallet");
        setSeedPhrase(words);
        localStorage.setItem('walletSeedPhrase', JSON.stringify(words));
        
        if (words.length >= 12) {
          setHasWallet(true);
          const simulatedBtcBalance = 0;
          setBtcBalance(simulatedBtcBalance);
          setEthBalance(0);
          const calculatedUsdBalance = (simulatedBtcBalance * btcPrice) + (0 * ethPrice);
          setUsdBalance(calculatedUsdBalance);
          const newAddress = generateBtcAddress();
          setWalletAddress(newAddress);
          setBalance(0);
          
          if (session) {
            setTimeout(() => {
              saveWalletAddressToUserAccount();
            }, 500);
          }
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
    setEthBalance(0);
    setUsdBalance(0);
    setWalletAddress('');
    setWallets([]);
    setActiveWalletState(null);
    localStorage.removeItem('walletSeedPhrase');
    localStorage.removeItem('wallets');
    localStorage.removeItem('walletAddress');
    
    if (session) {
      saveWalletAddressToUserAccount();
    }
  };

  useEffect(() => {
    console.log("Seed phrase updated:", seedPhrase ? seedPhrase.join(' ') : 'undefined');
    console.log("Seed phrase length:", seedPhrase.length);
    
    if (seedPhrase && seedPhrase.length >= 12) {
      console.log("Valid seed phrase detected, setting hasWallet to true");
      setHasWallet(true);
    }
  }, [seedPhrase]);

  const deleteWallet = (walletId: string) => {
    const walletToDelete = wallets.find(w => w.id === walletId);
    
    if (!walletToDelete) {
      console.error(`Wallet with ID ${walletId} not found`);
      return;
    }
    
    const isMainWallet = walletToDelete.name === 'Main Wallet';
    if (isMainWallet) {
      toast({
        title: "Hauptwallet kann nicht gelöscht werden",
        description: "Die Hauptwallet kann nicht gelöscht werden.",
        variant: "destructive"
      });
      return;
    }

    const isActiveWallet = walletToDelete.isActive;
    const updatedWallets = wallets.filter(wallet => wallet.id !== walletId);
    
    if (isActiveWallet && updatedWallets.length > 0) {
      updatedWallets[0].isActive = true;
      setSeedPhrase(updatedWallets[0].seedPhrase);
      setWalletAddress(updatedWallets[0].walletAddress);
      setBtcBalance(updatedWallets[0].btcBalance);
      setEthBalance(updatedWallets[0].ethBalance);
      
      const calculatedUsdBalance = (updatedWallets[0].btcBalance * btcPrice) + 
                                  (updatedWallets[0].ethBalance * ethPrice);
      setUsdBalance(calculatedUsdBalance);
      
      setActiveWalletState(updatedWallets[0]);
      
      if (session) {
        saveWalletAddressToUserAccount();
      }
    }
    
    setWallets(updatedWallets);
    
    toast({
      title: "Wallet gelöscht",
      description: "Die Wallet wurde erfolgreich gelöscht.",
    });
  };

  const logout = async () => {
    try {
      localStorage.removeItem('lastActivity');
      setPinVerified(false);
      
      await supabase.auth.signOut();
      resetWallet();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error logging out",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <WalletContext.Provider value={{ 
      hasWallet, 
      seedPhrase, 
      balance,
      btcBalance,
      btcPrice,
      ethBalance,
      ethPrice,
      usdBalance,
      walletAddress,
      isGenerating,
      session,
      isRefreshingPrices,
      cryptoPrices,
      wallets,
      activeWallet,
      enabledCryptos,
      refreshPrices,
      generateWallet,
      createWallet,
      cancelWalletCreation,
      importWallet,
      resetWallet,
      copyToClipboard,
      saveToSupabase,
      loadFromSupabase,
      addNewWallet,
      setActiveWallet,
      updateEnabledCryptos,
      deleteWallet,
      saveWalletAddressToUserAccount,
      loadWalletFromUserAccount,
      logout,
      pinProtectionEnabled,
      requirePinVerification,
      setRequirePinVerification,
      verifyPin,
      setPinProtectionEnabled,
      setPin,
      pinVerified,
      setPinVerified,
      refreshWalletBalance
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
