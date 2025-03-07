
import React from 'react';
import { 
  Bitcoin, 
  Coins,
  DollarSign,
  Droplet,
  Star,
  Wallet,
  Gem,
  Zap,
  Globe,
  Network,
  Shield,
  Tag,
  Key,
  CreditCard,
  Link
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface AssetIconProps {
  icon: React.ReactNode;
  color: string;
}

const AssetIcon = ({ icon, color }: AssetIconProps) => {
  return (
    <div className={`w-16 h-16 ${color} flex items-center justify-center rounded-xl transform rotate-45 overflow-hidden transition-all hover:scale-110 hover:shadow-lg hover:shadow-${color}/20`}>
      <div className="transform -rotate-45">
        {icon}
      </div>
    </div>
  );
};

const SupportedAssetsSection = () => {
  const navigate = useNavigate();
  
  const handleWalletAccess = () => {
    navigate('/wallet');
  };
  
  return (
    <section className="py-24 px-6 relative overflow-hidden bg-[#1A1F2C] text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1F2C] to-[#221F26]/90"></div>
      
      <div className="max-w-screen-xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-6xl md:text-8xl font-bold mb-4 text-center">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              200+
            </span>
          </h2>
          <p className="text-3xl md:text-4xl font-playfair text-white/90 mb-8">
            Assets und Tokens unterstützt
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Sparrow unterstützt Bitcoin und eine wachsende Liste von Kryptowährungen und Tokens
          </p>
        </div>
        
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-6 justify-center max-w-4xl mx-auto mb-16">
          <AssetIcon icon={<Bitcoin className="h-8 w-8 text-[#F7931A]" />} color="bg-[#1c1c28]" />
          <AssetIcon icon={<Coins className="h-8 w-8 text-[#627EEA]" />} color="bg-[#1c1c28]" />
          <AssetIcon icon={<Database className="h-8 w-8 text-[#345D9D]" />} color="bg-[#1c1c28]" />
          <AssetIcon icon={<Shield className="h-8 w-8 text-[#FF6600]" />} color="bg-[#1c1c28]" />
          <AssetIcon icon={<Tag className="h-8 w-8 text-[#C2A633]" />} color="bg-[#1c1c28]" />
          <AssetIcon icon={<Zap className="h-8 w-8 text-[#00AEFF]" />} color="bg-[#1c1c28]" />
          <AssetIcon icon={<Globe className="h-8 w-8 text-[#2775CA]" />} color="bg-[#1c1c28]" />
          <AssetIcon icon={<Star className="h-8 w-8 text-[#17181A]" />} color="bg-[#1c1c28]" />
          <AssetIcon icon={<Key className="h-8 w-8 text-[#E84142]" />} color="bg-[#1c1c28]" />
          <AssetIcon icon={<Network className="h-8 w-8 text-[#25292E]" />} color="bg-[#1c1c28]" />
          
          {/* Second row */}
          <AssetIcon icon={<Gem className="h-8 w-8 text-[#26A17B]" />} color="bg-[#1c1c28]" />
          <AssetIcon icon={<Shield className="h-8 w-8 text-[#6F41D8]" />} color="bg-[#1c1c28]" />
          <AssetIcon icon={<Database className="h-8 w-8 text-[#1FE5C1]" />} color="bg-[#1c1c28]" />
          <AssetIcon icon={<Star className="h-8 w-8 text-[#FF9900]" />} color="bg-[#1c1c28]" />
          <AssetIcon icon={<Globe className="h-8 w-8 text-[#FFD301]" />} color="bg-[#1c1c28]" />
          <AssetIcon icon={<Wallet className="h-8 w-8 text-[#F1B32B]" />} color="bg-[#1c1c28]" />
          <AssetIcon icon={<Zap className="h-8 w-8 text-[#1BA27A]" />} color="bg-[#1c1c28]" />
          <AssetIcon icon={<Tag className="h-8 w-8 text-[#2B31C3]" />} color="bg-[#1c1c28]" />
          <AssetIcon icon={<Coins className="h-8 w-8 text-[#474DFF]" />} color="bg-[#1c1c28]" />
          <AssetIcon icon={<Bitcoin className="h-8 w-8 text-[#16D1AA]" />} color="bg-[#1c1c28]" />
        </div>
        
        <div className="relative mx-auto mt-8 max-w-5xl">
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1F2C] to-transparent pointer-events-none z-10"></div>
          <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-4 opacity-40 max-h-60 overflow-hidden">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="w-12 h-12 bg-[#1c1c28] rounded-xl flex items-center justify-center transform rotate-45">
                <div className="transform -rotate-45">
                  <Wallet className="h-5 w-5 text-gray-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="font-medium text-xl mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent max-w-2xl mx-auto">
            Jeden Monat kommen weitere Kryptowährungen und Token hinzu
          </p>
          
          <Button 
            onClick={handleWalletAccess}
            className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white py-6 px-8 rounded-lg text-lg"
          >
            Alle unterstützten Assets anzeigen
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SupportedAssetsSection;
