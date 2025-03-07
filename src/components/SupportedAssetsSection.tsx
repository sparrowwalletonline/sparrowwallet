
import React from 'react';
import { 
  Bitcoin, 
  Wallet, 
  Coins,
  Database,
  Tag,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface AssetCardProps {
  icon: React.ReactNode;
  name: string;
  symbol: string;
  description?: string;
}

const AssetCard = ({ icon, name, symbol, description }: AssetCardProps) => {
  return (
    <div className="p-3 rounded-lg bg-white dark:bg-wallet-card shadow-sm transition-all hover:shadow-md hover:-translate-y-1 border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-wallet-blue">
          {icon}
        </div>
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">{name}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">{symbol}</p>
        </div>
      </div>
      {description && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{description}</p>
      )}
    </div>
  );
};

const SupportedAssetsSection = () => {
  const navigate = useNavigate();
  
  const handleWalletAccess = () => {
    navigate('/wallet');
  };
  
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-wallet-darkBg/80 dark:to-wallet-bg/80"></div>
      
      <div className="max-w-screen-xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-50 dark:bg-blue-900/20 mb-4">
            <Coins className="h-6 w-6 text-wallet-blue" />
          </div>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-wallet-blue to-indigo-600 bg-clip-text text-transparent">
              + 200 Assets und Token unterstützt
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Sparrow unterstützt Bitcoin und eine wachsende Liste von Kryptowährungen und Tokens
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
          <AssetCard 
            icon={<Bitcoin className="h-5 w-5" />} 
            name="Bitcoin" 
            symbol="BTC" 
          />
          <AssetCard 
            icon={<Coins className="h-5 w-5" />} 
            name="Ethereum" 
            symbol="ETH" 
          />
          <AssetCard 
            icon={<Database className="h-5 w-5" />} 
            name="Litecoin" 
            symbol="LTC" 
          />
          <AssetCard 
            icon={<Shield className="h-5 w-5" />} 
            name="Monero" 
            symbol="XMR" 
          />
          <AssetCard 
            icon={<Tag className="h-5 w-5" />} 
            name="Dogecoin" 
            symbol="DOGE" 
          />
          
          <div className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5 mt-6 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-wallet-bg to-transparent pointer-events-none z-10"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-40 overflow-hidden">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/50 dark:bg-wallet-card/50 border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                      <Wallet className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="w-full">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-3/4 mb-2"></div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-center space-y-6">
          <p className="font-medium text-lg bg-gradient-to-r from-wallet-blue to-indigo-600 bg-clip-text text-transparent">
            Jeden Monat kommen weitere Kryptowährungen und Token hinzu
          </p>
          
          <Button 
            onClick={handleWalletAccess}
            className="bg-wallet-blue hover:bg-wallet-darkBlue text-white py-6 px-8 rounded-xl text-lg"
          >
            Alle unterstützten Assets anzeigen
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SupportedAssetsSection;
