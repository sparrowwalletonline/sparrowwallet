
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWallet } from '@/contexts/WalletContext';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ConfirmDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  recipientAddress: string;
  amount: number;
  btcPrice: number;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  setOpen,
  recipientAddress,
  amount,
  btcPrice
}) => {
  const { sendBitcoin, activeWallet } = useWallet();
  const [isLoading, setIsLoading] = React.useState(false);
  const [recipientUsername, setRecipientUsername] = React.useState<string | null>(null);
  
  // Check if the recipient address belongs to a registered user
  React.useEffect(() => {
    const getUsernameByWalletAddress = async () => {
      try {
        const { data, error } = await supabase
          .from('user_wallets')
          .select('users(email)')
          .eq('wallet_address', recipientAddress)
          .single();
        
        if (data && data.users && data.users.email) {
          // Extract username from the email (e.g., user@example.com -> user)
          const username = data.users.email.split('@')[0];
          setRecipientUsername(username);
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    if (recipientAddress) {
      getUsernameByWalletAddress();
    }
  }, [recipientAddress]);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await sendBitcoin(recipientAddress, amount);
      setOpen(false);
      toast({
        title: "Transaktion erfolgreich",
        description: `${amount} BTC wurden erfolgreich versendet`,
      });
    } catch (error) {
      console.error("Transaction error:", error);
      toast({
        title: "Transaktion fehlgeschlagen",
        description: "Es gab ein Problem bei der Verarbeitung der Transaktion",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Transaktion bestätigen</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Absender</h3>
            <div className="p-3 bg-muted rounded-md">
              <p className="font-medium">{activeWallet?.name || 'Meine Wallet'}</p>
              <p className="text-xs text-muted-foreground truncate">{activeWallet?.address}</p>
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
              <div className="p-3 bg-muted rounded-md">
                <p className="text-xs text-muted-foreground">Betrag</p>
                <p className="font-medium">{amount} BTC</p>
              </div>
              
              <div className="p-3 bg-muted rounded-md">
                <p className="text-xs text-muted-foreground">Wert in USD</p>
                <p className="font-medium">${(amount * btcPrice).toFixed(2)}</p>
              </div>
              
              <div className="p-3 bg-muted rounded-md col-span-2">
                <p className="text-xs text-muted-foreground">Netzwerkgebühr</p>
                <p className="font-medium">0.0001 BTC</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Abbrechen
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? "Wird verarbeitet..." : "Bestätigen"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
