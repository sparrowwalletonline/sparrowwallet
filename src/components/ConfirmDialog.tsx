
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWallet } from '@/contexts/WalletContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  recipientAddress: string;
  amount: number;
  btcPrice: number;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  setOpen,
  recipientAddress,
  amount,
  btcPrice
}) => {
  const { activeWallet, sendBitcoin } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [recipientUsername, setRecipientUsername] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchRecipientUsername = async () => {
      if (!recipientAddress) return;
      
      try {
        const { data, error } = await supabase
          .from('user_wallets')
          .select(`
            wallet_address,
            profiles!inner (
              username
            )
          `)
          .eq('wallet_address', recipientAddress)
          .single();
        
        if (!error && data && data.profiles && data.profiles.username) {
          setRecipientUsername(data.profiles.username);
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };
    
    fetchRecipientUsername();
  }, [recipientAddress]);
  
  const handleConfirm = async () => {
    if (!activeWallet || !recipientAddress || amount <= 0) return;
    
    setIsLoading(true);
    
    try {
      await sendBitcoin(recipientAddress, amount);
      
      toast({
        title: "Transaktion erfolgreich",
        description: "Die Bitcoins wurden erfolgreich gesendet.",
      });
      
      setOpen(false);
    } catch (error) {
      console.error("Error sending Bitcoin:", error);
      
      toast({
        title: "Fehler bei der Transaktion",
        description: "Die Transaktion konnte nicht durchgeführt werden.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Transaktion bestätigen</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Absender</h3>
            <div className="p-3 bg-muted rounded-md">
              <p className="font-medium">{activeWallet?.name || 'Meine Wallet'}</p>
              <p className="text-xs text-muted-foreground truncate">{activeWallet?.walletAddress}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Empfänger</h3>
            <div className="p-3 bg-muted rounded-md">
              {recipientUsername && (
                <p className="font-medium">{recipientUsername}</p>
              )}
              <p className="text-xs text-muted-foreground truncate">{recipientAddress}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Details</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-muted rounded-md space-y-1">
                <p className="text-xs text-muted-foreground">Betrag (BTC)</p>
                <p className="font-medium">{amount} BTC</p>
              </div>
              <div className="p-3 bg-muted rounded-md space-y-1">
                <p className="text-xs text-muted-foreground">Wert (USD)</p>
                <p className="font-medium">${(amount * btcPrice).toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="pt-2 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Abbrechen
            </Button>
            <Button onClick={handleConfirm} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Wird gesendet...
                </>
              ) : (
                "Bestätigen"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
