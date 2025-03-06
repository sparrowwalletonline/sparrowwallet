
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownLeft, ShoppingCart, Sparkles } from 'lucide-react';

const WalletActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-4 gap-2 mt-6">
      <div className="flex flex-col items-center">
        <Button
          variant="wallet"
          className="w-12 h-12 rounded-full bg-[#0500ff] hover:bg-[#0500ff]/90"
          onClick={() => navigate('/wallet/send')}
        >
          <ArrowUpRight className="h-5 w-5" />
        </Button>
        <span className="text-xs mt-2 text-muted-foreground">Senden</span>
      </div>

      <div className="flex flex-col items-center">
        <Button
          variant="wallet"
          className="w-12 h-12 rounded-full bg-[#0500ff] hover:bg-[#0500ff]/90"
          onClick={() => navigate('/wallet/receive')}
        >
          <ArrowDownLeft className="h-5 w-5" />
        </Button>
        <span className="text-xs mt-2 text-muted-foreground">Empfangen</span>
      </div>

      <div className="flex flex-col items-center">
        <Button
          variant="wallet"
          className="w-12 h-12 rounded-full bg-[#0500ff] hover:bg-[#0500ff]/90"
          onClick={() => navigate('/wallet/buy')}
        >
          <ShoppingCart className="h-5 w-5" />
        </Button>
        <span className="text-xs mt-2 text-muted-foreground">Kaufen</span>
      </div>

      <div className="flex flex-col items-center">
        <Button
          variant="wallet"
          className="w-12 h-12 rounded-full bg-[#0500ff] hover:bg-[#0500ff]/90"
          onClick={() => navigate('/wallet/earn')}
        >
          <Sparkles className="h-5 w-5" />
        </Button>
        <span className="text-xs mt-2 text-muted-foreground">Verdienen</span>
      </div>
    </div>
  );
};

export default WalletActions;
