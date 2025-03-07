import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { fetchCryptoPrices, CryptoPrice } from '@/utils/cryptoPriceUtils';
interface AssetIconProps {
  image?: string;
  name?: string;
  symbol?: string;
  fallbackIcon?: React.ReactNode;
}
const AssetIcon = ({
  image,
  name,
  symbol,
  fallbackIcon
}: AssetIconProps) => {
  return <div className="flex flex-col items-center">
      <div className="w-16 h-16 bg-[#1c1c28] flex items-center justify-center rounded-xl transform rotate-45 overflow-hidden transition-all hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20">
        <div className="transform -rotate-45 flex items-center justify-center w-full h-full">
          {image ? <img src={image} alt={name || symbol} className="h-8 w-8 object-contain" onError={e => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent && fallbackIcon) {
            const fallbackDiv = document.createElement('div');
            parent.appendChild(fallbackDiv);
          }
        }} /> : fallbackIcon || <div className="h-8 w-8 bg-gray-500 rounded-full"></div>}
        </div>
      </div>
      {symbol && <span className="mt-2 text-sm text-gray-300 font-medium">{symbol}</span>}
    </div>;
};
const SupportedAssetsSection = () => {
  const navigate = useNavigate();
  const [cryptoData, setCryptoData] = useState<Record<string, CryptoPrice>>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadCryptoData = async () => {
      setLoading(true);
      try {
        const data = await fetchCryptoPrices();
        setCryptoData(data);
      } catch (error) {
        console.error('Failed to load crypto data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCryptoData();
  }, []);
  const handleWalletAccess = () => {
    navigate('/wallet');
  };

  // Get top 20 cryptos by market cap (assuming they're already sorted)
  const topCryptos = Object.values(cryptoData).slice(0, 20);
  return <section className="py-24 px-6 relative overflow-hidden bg-[#1A1F2C] text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1F2C] to-[#221F26]/90"></div>
      
      <div className="max-w-screen-xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-roboto text-6xl md:text-8xl font-bold mb-4 text-center">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              200+
            </span>
          </h2>
          <p className="text-3xl md:text-4xl font-roboto font-bold text-white/90 mb-8">
            Assets und Tokens unterstützt
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Sparrow unterstützt Bitcoin und eine wachsende Liste von Kryptowährungen und Tokens
          </p>
        </div>
        
        {loading ? <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-6 justify-center max-w-4xl mx-auto mb-16">
            {Array.from({
          length: 20
        }).map((_, i) => <div key={i} className="w-16 h-16 bg-[#1c1c28]/50 animate-pulse rounded-xl"></div>)}
          </div> : <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-6 justify-center max-w-4xl mx-auto mb-16">
            {topCryptos.map((crypto, index) => <AssetIcon key={index} image={crypto.image} name={crypto.name} symbol={crypto.symbol} />)}
          </div>}
        
        <div className="relative mx-auto mt-8 max-w-5xl">
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1F2C] to-transparent pointer-events-none z-10"></div>
          <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-4 opacity-40 max-h-60 overflow-hidden">
            {Object.values(cryptoData).slice(20, 80).map((crypto, index) => <div key={index} className="w-12 h-12 bg-[#1c1c28] rounded-xl flex items-center justify-center transform rotate-45">
                <div className="transform -rotate-45">
                  {crypto.image ? <img src={crypto.image} alt={crypto.name || crypto.symbol} className="h-5 w-5 object-contain" /> : <div className="h-5 w-5 bg-gray-500 rounded-full"></div>}
                </div>
              </div>)}
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="font-medium text-xl mb-8 font-roboto bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent max-w-2xl mx-auto">
            Jeden Monat kommen weitere Kryptowährungen und Token hinzu
          </p>
          
          <Button onClick={handleWalletAccess} className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white py-6 rounded-lg text-lg px-[8px]">
            Alle unterstützten Assets anzeigen
          </Button>
        </div>
      </div>
    </section>;
};
export default SupportedAssetsSection;