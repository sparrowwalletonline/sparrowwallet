
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
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
          <CircleDollarSign className="h-5 w-5" />
          <span className="sr-only">Wallet Info</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">Wallet Details</p>
          <p className="text-xs text-muted-foreground">{activeWallet?.name}</p>
        </div>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
            {activeWallet?.walletAddress}
          </p>
        </div>
        <DropdownMenuItem onClick={handleCopyAddress}>
          <Copy className="mr-2 h-4 w-4" />
          <span>Copy Address</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WalletInfoButton;
