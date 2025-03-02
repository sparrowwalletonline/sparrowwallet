
import React from 'react';
import { Repeat, CreditCard } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { toast } from '@/components/ui/use-toast';
import { Button } from "@/components/ui/button";

const WalletActions: React.FC = () => {
  const handleAction = (action: string) => {
    toast({
      title: `${action}`,
      description: `This is a demo. No actual ${action.toLowerCase()} will be performed.`,
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
        onClick={() => handleAction('buy')}
      >
        <CreditCard className="h-6 w-6 text-green-500" />
        <span className="text-xs">Kaufen</span>
      </Button>
    </div>
  );
};

export default WalletActions;
