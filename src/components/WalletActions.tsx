
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownLeft, History, Settings, Grid3X3 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const WalletActions: React.FC = () => {
  const handleAction = (action: string) => {
    toast({
      title: `${action} Transaction`,
      description: `This is a demo. No actual ${action.toLowerCase()} transaction will be performed.`,
    });
  };

  return (
    <div className="animate-fade-in mt-6">
      {/* Primary Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Button 
          className="h-14 bg-wallet-blue hover:bg-wallet-darkBlue text-white shadow-sm"
          onClick={() => handleAction('Send')}
        >
          <ArrowUpRight className="mr-2 h-5 w-5" />
          Send
        </Button>
        
        <Button 
          className="h-14 bg-wallet-blue hover:bg-wallet-darkBlue text-white shadow-sm"
          onClick={() => handleAction('Receive')}
        >
          <ArrowDownLeft className="mr-2 h-5 w-5" />
          Receive
        </Button>
      </div>
      
      {/* Secondary Actions */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: <History className="h-5 w-5" />, label: "History" },
          { icon: <Grid3X3 className="h-5 w-5" />, label: "dApps" },
          { icon: <Settings className="h-5 w-5" />, label: "Settings" },
          { icon: <Bitcoin className="h-5 w-5" />, label: "Buy" }
        ].map((item, index) => (
          <button 
            key={index}
            className="flex flex-col items-center gap-1 rounded-lg p-3 transition-colors hover:bg-slate-100"
            onClick={() => toast({ title: `${item.label}`, description: "This feature is not available in the demo." })}
          >
            {item.icon}
            <span className="text-xs text-wallet-gray">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Bitcoin icon component
const Bitcoin = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24"
    fill="none" 
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042l-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893l-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042l.346-1.97M7.48 20.364l3.126-17.727" />
  </svg>
);

export default WalletActions;
