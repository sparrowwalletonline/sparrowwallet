
import React, { useState } from 'react';
import { Repeat, CreditCard, X } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { toast } from '@/components/ui/use-toast';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const WalletActions: React.FC = () => {
  const [showBuyDialog, setShowBuyDialog] = useState(false);

  const handleAction = (action: string) => {
    toast({
      title: `${action}`,
      description: `This is a demo. No actual ${action.toLowerCase()} will be performed.`
    });
  };

  return (
    <div className="flex justify-around py-4 px-2 gap-4">
      <Button 
        variant="ghost" 
        className="flex-1 flex flex-col items-center gap-1 hover:bg-gray-800"
        onClick={() => handleAction('swap')}
      >
        <Repeat className="h-6 w-6 text-green-500" />
        <span className="text-xs">Swappen</span>
      </Button>
      <Button 
        variant="ghost" 
        className="flex-1 flex flex-col items-center gap-1 hover:bg-gray-800"
        onClick={() => setShowBuyDialog(true)}
      >
        <CreditCard className="h-6 w-6 text-green-500" />
        <span className="text-xs">Kaufen</span>
      </Button>

      <Dialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
        <DialogContent className="bg-gray-900 border border-gray-800 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Kauf nicht verfügbar</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-gray-300">
            Der direkte Kauf von Kryptowährungen ist in Ihrer Region leider noch nicht verfügbar. Wir arbeiten daran, diesen Service bald anzubieten.
          </DialogDescription>
          <div className="flex justify-end mt-4">
            <Button 
              variant="wallet" 
              onClick={() => setShowBuyDialog(false)}
              className="px-4 py-2"
            >
              Verstanden
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletActions;
