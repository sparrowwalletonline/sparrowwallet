
import { supabase } from "@/integrations/supabase/client";
import { Session } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';
import { encryptSeedPhrase, decryptSeedPhrase } from './encryptionUtils';
import { generateBtcAddress } from './walletUtils';

export const saveWalletToSupabase = async (
  session: Session | null, 
  seedPhrase: string[]
): Promise<boolean> => {
  if (!session?.user) {
    console.log("Cannot save to Supabase: No user session");
    toast({
      title: "Fehler",
      description: "Du musst angemeldet sein, um zu speichern",
      variant: "destructive",
      duration: 3000,
    });
    return false;
  }
  
  if (!seedPhrase || seedPhrase.length < 12) {
    console.log("Cannot save to Supabase: Invalid seed phrase");
    console.log("Seed phrase length:", seedPhrase ? seedPhrase.length : 0);
    
    toast({
      title: "Fehler",
      description: "Ungültige Seed Phrase",
      variant: "destructive",
      duration: 3000,
    });
    return false;
  }

  try {
    console.log("Encrypting and saving seed phrase to Supabase");
    const encryptedPhrase = encryptSeedPhrase(seedPhrase);
    
    if (!encryptedPhrase) {
      console.error("Error: Failed to encrypt seed phrase");
      toast({
        title: "Fehler beim Speichern",
        description: "Die Seed Phrase konnte nicht verschlüsselt werden",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }
    
    // First check if there's already an entry for this user
    const { data: existingData, error: checkError } = await supabase
      .from('wallet_seed_phrases')
      .select('id')
      .eq('user_id', session.user.id)
      .maybeSingle();
      
    if (checkError) {
      console.error("Error checking existing seed phrase:", checkError);
      toast({
        title: "Fehler beim Speichern",
        description: checkError.message,
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }
    
    let saveResult;
    if (existingData?.id) {
      // Update existing record
      console.log("Updating existing seed phrase record");
      saveResult = await supabase
        .from('wallet_seed_phrases')
        .update({
          encrypted_seed_phrase: encryptedPhrase
        })
        .eq('user_id', session.user.id);
    } else {
      // Insert new record
      console.log("Creating new seed phrase record");
      saveResult = await supabase
        .from('wallet_seed_phrases')
        .insert({
          user_id: session.user.id,
          encrypted_seed_phrase: encryptedPhrase
        });
    }
    
    const { error } = saveResult;
    if (error) {
      console.error("Error saving seed phrase to Supabase:", error);
      toast({
        title: "Fehler beim Speichern",
        description: error.message,
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }

    console.log("Seed phrase saved to Supabase successfully");
    toast({
      title: "Erfolgreich gespeichert",
      description: "Deine Seed Phrase wurde in der Cloud gespeichert",
      duration: 3000,
    });
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Ein unerwarteter Fehler ist aufgetreten';
    console.error("Exception saving seed phrase to Supabase:", error);
    toast({
      title: "Fehler beim Speichern",
      description: errorMessage,
      variant: "destructive",
      duration: 3000,
    });
    return false;
  }
};

export const loadWalletFromSupabase = async (
  session: Session | null,
  setBtcBalance: (value: number) => void,
  setUsdBalance: (value: number) => void,
  setWalletAddress: (value: string) => void,
  setBalance: (value: number) => void,
  btcPrice: number
): Promise<string[] | null> => {
  if (!session?.user) {
    console.log("Cannot load from Supabase: No user session");
    toast({
      title: "Fehler",
      description: "Du musst angemeldet sein, um deine Seed Phrase zu laden",
      variant: "destructive",
      duration: 3000,
    });
    return null;
  }

  try {
    // Load seed phrase
    const { data, error } = await supabase
      .from('wallet_seed_phrases')
      .select('encrypted_seed_phrase')
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (error) {
      console.error("Error loading seed phrase from Supabase:", error);
      toast({
        title: "Fehler beim Laden",
        description: error.message,
        variant: "destructive",
        duration: 3000,
      });
      return null;
    }

    if (data && data.encrypted_seed_phrase) {
      const decryptedPhrase = decryptSeedPhrase(data.encrypted_seed_phrase);
      
      if (decryptedPhrase && decryptedPhrase.length >= 12) {
        // Load wallet data
        const { data: walletData, error: walletError } = await supabase
          .from('user_wallets')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();
          
        if (walletError) {
          console.error("Error loading wallet data:", walletError);
        } else if (walletData) {
          setBtcBalance(Number(walletData.btc_balance));
          setWalletAddress(walletData.wallet_address);
          const calculatedUsdBalance = Number(walletData.btc_balance) * btcPrice;
          setUsdBalance(calculatedUsdBalance);
          setBalance(Number(walletData.btc_balance));
        }
        
        toast({
          title: "Erfolgreich geladen",
          description: "Deine Seed Phrase wurde aus der Cloud geladen",
          duration: 3000,
        });
        return decryptedPhrase;
      }
    }
    
    console.log("No seed phrase found in Supabase");
    toast({
      title: "Keine Seed Phrase gefunden",
      description: "Es wurde keine gespeicherte Seed Phrase gefunden",
      variant: "destructive",
      duration: 3000,
    });
    return null;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Ein unerwarteter Fehler ist aufgetreten';
    console.error("Exception loading seed phrase from Supabase:", error);
    toast({
      title: "Fehler beim Laden",
      description: errorMessage,
      variant: "destructive",
      duration: 3000,
    });
    return null;
  }
};
