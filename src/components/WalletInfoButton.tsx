
import React from 'react';
import { CircleDollarSign, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useWallet } from '@/contexts/WalletContext';
import { toast } from '@/components/ui/use-toast';
import { copyToClipboard } from '@/utils/clipboardUtils';

const WalletInfoButton = () => {
  const { activeWallet } = useWallet();

  const handleCopyAddress = () => {
    if (activeWallet?.walletAddress) {
      copyToClipboard(activeWallet.walletAddress);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-all text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <CircleDollarSign className="h-5 w-5" />
          <span className="sr-only">Wallet Info</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl border border-gray-100 shadow-lg dark:border-gray-800">
        <div className="px-3 py-2">
          <p className="text-sm font-medium">Wallet Details</p>
          <p className="text-xs text-muted-foreground">{activeWallet?.name}</p>
        </div>
        <DropdownMenuSeparator />
        <div className="px-3 py-2">
          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
            {activeWallet?.walletAddress}
          </p>
        </div>
        <DropdownMenuItem onClick={handleCopyAddress} className="rounded-md mx-1 my-1 cursor-pointer">
          <Copy className="mr-2 h-4 w-4" />
          <span>Copy Address</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WalletInfoButton;
