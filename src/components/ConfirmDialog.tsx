
import React, { useState } from 'react';
import { Check, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { supabase, getUsernameByWalletAddress } from '@/integrations/supabase/client';
import { useWallet } from '@/contexts/WalletContext';
import { toast } from '@/components/ui/use-toast';

interface ConfirmDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  recipientAddress: string;
  amount: number;
  btcPrice: number;
}

export const ConfirmDialog = ({ 
  open, 
  setOpen, 
  recipientAddress, 
  amount, 
  btcPrice 
}: ConfirmDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [recipientUsername, setRecipientUsername] = useState<string | null>(null);
  const { btcBalance, refreshWalletBalance } = useWallet();

  // Check if this is a registered user's wallet
  React.useEffect(() => {
    if (open && recipientAddress) {
      const checkRecipientUsername = async () => {
        const username = await getUsernameByWalletAddress(recipientAddress);
        setRecipientUsername(username);
      };
      
      checkRecipientUsername();
    }
  }, [open, recipientAddress]);

  const handleConfirm = async () => {
    setLoading(true);
    
    // Check if user has enough balance
    if (btcBalance < amount) {
      toast({
        title: "Unzureichendes Guthaben",
        description: "Du hast nicht genug BTC für diese Transaktion.",
        variant: "destructive",
      });
      setLoading(false);
      setOpen(false);
      return;
    }

    try {
      // Simulate a delay for the transaction process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Transaktion erfolgreich",
        description: "Deine Transaktion wurde erfolgreich gesendet.",
      });
      
      // Refresh wallet balance
      await refreshWalletBalance();
      
    } catch (error) {
      toast({
        title: "Fehler bei der Transaktion",
        description: "Ein Fehler ist aufgetreten. Bitte versuche es später erneut.",
        variant: "destructive",
      });
      console.error("Transaction error:", error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Transaktion bestätigen</AlertDialogTitle>
          <AlertDialogDescription>
            Bitte überprüfe die Transaktionsdetails sorgfältig.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="my-4 space-y-4">
          <div className="bg-muted p-4 rounded-md space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Von:</span>
              <span className="font-medium">Deine Wallet</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">An:</span>
              <div className="text-right">
                <div className="font-medium">{recipientUsername ? `@${recipientUsername}` : 'Externe Wallet'}</div>
                <div className="text-xs text-muted-foreground truncate max-w-[220px]">
                  {recipientAddress}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Betrag:</span>
              <div className="text-right">
                <div className="font-medium">{amount} BTC</div>
                <div className="text-xs text-muted-foreground">
                  ≈ ${(amount * btcPrice).toFixed(2)} USD
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-2 text-amber-600 dark:text-amber-500">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Sicherheitshinweis</p>
              <p>Überweisungen können nicht rückgängig gemacht werden. Stelle sicher, dass die Adresse korrekt ist.</p>
            </div>
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Abbrechen</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={loading}
            className="bg-primary"
          >
            {loading ? (
              <div className="flex items-center gap-1">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                <span>Verarbeitung...</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Check className="h-4 w-4" />
                <span>Bestätigen</span>
              </div>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
