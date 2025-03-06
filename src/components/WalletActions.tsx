
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
          className="w-14 h-14 rounded-full shadow-[0_4px_10px_rgba(5,0,255,0.3)] hover:shadow-[0_6px_14px_rgba(5,0,255,0.4)]"
          onClick={() => navigate('/wallet/send')}
        >
          <ArrowUpRight className="h-6 w-6" />
        </Button>
        <span className="text-xs mt-2 text-muted-foreground font-medium">Senden</span>
      </div>

      <div className="flex flex-col items-center">
        <Button
          variant="wallet"
          className="w-14 h-14 rounded-full shadow-[0_4px_10px_rgba(5,0,255,0.3)] hover:shadow-[0_6px_14px_rgba(5,0,255,0.4)]"
          onClick={() => navigate('/wallet/receive')}
        >
          <ArrowDownLeft className="h-6 w-6" />
        </Button>
        <span className="text-xs mt-2 text-muted-foreground font-medium">Empfangen</span>
      </div>

      <div className="flex flex-col items-center">
        <Button
          variant="wallet"
          className="w-14 h-14 rounded-full shadow-[0_4px_10px_rgba(5,0,255,0.3)] hover:shadow-[0_6px_14px_rgba(5,0,255,0.4)]"
          onClick={() => navigate('/wallet/buy')}
        >
          <ShoppingCart className="h-6 w-6" />
        </Button>
        <span className="text-xs mt-2 text-muted-foreground font-medium">Kaufen</span>
      </div>

      <div className="flex flex-col items-center">
        <Button
          variant="wallet"
          className="w-14 h-14 rounded-full shadow-[0_4px_10px_rgba(5,0,255,0.3)] hover:shadow-[0_6px_14px_rgba(5,0,255,0.4)]"
          onClick={() => navigate('/wallet/earn')}
        >
          <Sparkles className="h-6 w-6" />
        </Button>
        <span className="text-xs mt-2 text-muted-foreground font-medium">Verdienen</span>
      </div>
    </div>
  );
};

export default WalletActions;
