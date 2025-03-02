import React from 'react';
import { toast } from '@/components/ui/use-toast';

const WalletActions: React.FC = () => {
  const handleAction = (action: string) => {
    toast({
      title: `${action}`,
      description: `This is a demo. No actual ${action.toLowerCase()} will be performed.`,
    });
  };

  return null;
};

export default WalletActions;
