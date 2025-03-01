
import { supabase } from "@/integrations/supabase/client";
import { Session } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';
import { encryptSeedPhrase, decryptSeedPhrase } from './encryptionUtils';
import { generateBtcAddress } from './walletUtils';

export const saveWalletToSupabase = async (
  session: Session | null, 
  seedPhrase: string[]
): Promise<boolean> => {
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
    });
    return null;
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
      return null;
    }

    if (data && data.encrypted_seed_phrase) {
      const decryptedPhrase = decryptSeedPhrase(data.encrypted_seed_phrase);
      
      if (decryptedPhrase && decryptedPhrase.length >= 12) {
        // Update wallet state values
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
        return decryptedPhrase;
      } else {
        console.error("Invalid decrypted seed phrase:", decryptedPhrase);
        toast({
          title: "Fehler beim Laden",
          description: "Die gespeicherte Seed Phrase ist ungültig",
          variant: "destructive",
        });
        return null;
      }
    } else {
      console.log("No seed phrase found in Supabase");
      toast({
        title: "Keine Seed Phrase gefunden",
        description: "Es wurde keine gespeicherte Seed Phrase gefunden",
        variant: "destructive",
      });
      return null;
    }
  } catch (error) {
    console.error("Exception loading seed phrase from Supabase:", error);
    toast({
      title: "Fehler beim Laden",
      description: "Ein unerwarteter Fehler ist aufgetreten",
      variant: "destructive",
    });
    return null;
  }
};
