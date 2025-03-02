
import React, { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { toast } from '@/components/ui/use-toast';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const WalletActions: React.FC = () => {
  const [showBuyDialog, setShowBuyDialog] = useState(false);

  return (
    <div>
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
