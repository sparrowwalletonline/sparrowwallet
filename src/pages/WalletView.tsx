import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WalletProvider, useWallet } from '@/contexts/WalletContext';
import Header from '@/components/Header';
import WalletBalance from '@/components/WalletBalance';
import WalletActions from '@/components/WalletActions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Home, RefreshCcw, Compass, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Inner component that uses the wallet context
const WalletViewContent: React.FC = () => {
  const { 
    hasWallet, 
    btcBalance, 
    btcPrice, 
    ethBalance, 
    ethPrice, 
    cryptoPrices, 
    refreshPrices,
    isRefreshingPrices 
  } = useWallet();
  const navigate = useNavigate();

  // Redirect if no wallet exists
  React.useEffect(() => {
    if (!hasWallet) {
      navigate('/');
    }
  }, [hasWallet, navigate]);

  // Calculate USD values
  const btcValue = (btcBalance * btcPrice).toFixed(2);
  const ethValue = (ethBalance * ethPrice).toFixed(2);
  
  // Updated cryptocurrency data that uses real-time prices
  const cryptoData = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      amount: btcBalance.toString(),
      price: cryptoPrices.BTC?.price || btcPrice,
      value: parseFloat(btcValue),
      change: cryptoPrices.BTC ? 
        (cryptoPrices.BTC.change_percentage_24h >= 0 ? "+" : "") + 
        cryptoPrices.BTC.change_percentage_24h.toFixed(2) + "%" : 
        "+1.52%",
      iconColor: "bg-[#F7931A]",
      changeColor: cryptoPrices.BTC?.change_percentage_24h >= 0 ? "text-green-500" : "text-red-500",
      logoUrl: "/lovable-uploads/7e1fa6ef-c45f-4ce0-af71-fa865a931600.png"
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      amount: ethBalance.toString(),
      price: cryptoPrices.ETH?.price || ethPrice,
      value: parseFloat(ethValue),
      change: cryptoPrices.ETH ? 
        (cryptoPrices.ETH.change_percentage_24h >= 0 ? "+" : "") + 
        cryptoPrices.ETH.change_percentage_24h.toFixed(2) + "%" : 
        "-0.12%",
      iconColor: "bg-[#627EEA]",
      changeColor: cryptoPrices.ETH?.change_percentage_24h >= 0 ? "text-green-500" : "text-red-500",
      logoUrl: "/lovable-uploads/14bf916a-665e-4e15-b4c5-631d8d5ff633.png"
    },
    {
      symbol: "BNB",
      name: "BNB Smart Chain",
      amount: "0.05",
      price: cryptoPrices.BNB?.price || 610.26,
      value: cryptoPrices.BNB ? 0.05 * cryptoPrices.BNB.price : 30.51,
      change: cryptoPrices.BNB ? 
        (cryptoPrices.BNB.change_percentage_24h >= 0 ? "+" : "") + 
        cryptoPrices.BNB.change_percentage_24h.toFixed(2) + "%" : 
        "+2.55%",
      iconColor: "bg-[#F3BA2F]",
      changeColor: cryptoPrices.BNB?.change_percentage_24h >= 0 ? "text-green-500" : "text-red-500",
      logoUrl: "/lovable-uploads/dc54f948-8605-4e6b-a659-7f492598ea5c.png"
    },
    {
      symbol: "POL",
      name: "Polygon",
      amount: "20",
      price: cryptoPrices.POL?.price || 0.27,
      value: cryptoPrices.POL ? 20 * cryptoPrices.POL.price : 5.40,
      change: cryptoPrices.POL ? 
        (cryptoPrices.POL.change_percentage_24h >= 0 ? "+" : "") + 
        cryptoPrices.POL.change_percentage_24h.toFixed(2) + "%" : 
        "+3.37%",
      iconColor: "bg-[#8247E5]",
      changeColor: cryptoPrices.POL?.change_percentage_24h >= 0 ? "text-green-500" : "text-red-500",
      logoUrl: "/lovable-uploads/9c181aad-4d83-4b09-957f-11721da14747.png"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-wallet-darkBg text-wallet-text">
      <Header title="Home" />
      
      {/* Search Bar */}
      <div className="px-4 mb-4">
        <div className="flex items-center bg-wallet-card rounded-full px-4 py-2">
          <Search className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-400">Search</span>
        </div>
      </div>
      
      {/* Wallet Selector */}
      <div className="px-4 mb-4">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Main wallet</span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="#8A8D97" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col px-4">
        <WalletBalance />
        <WalletActions />
        
        {/* Tabs for Crypto/NFTs */}
        <div className="mt-6">
          <Tabs defaultValue="crypto" className="w-full">
            <div className="flex justify-between items-center">
              <TabsList className="grid w-40 grid-cols-2 bg-transparent border-b border-gray-800">
                <TabsTrigger 
                  value="crypto" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-wallet-green data-[state=active]:text-white data-[state=active]:shadow-none rounded-none bg-transparent text-gray-400"
                >
                  Crypto
                </TabsTrigger>
                <TabsTrigger 
                  value="nfts" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-wallet-green data-[state=active]:text-white data-[state=active]:shadow-none rounded-none bg-transparent text-gray-400"
                >
                  NFTs
                </TabsTrigger>
              </TabsList>
              
              {/* Refresh Button */}
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
                onClick={refreshPrices}
                disabled={isRefreshingPrices}
              >
                <RefreshCcw className={`h-4 w-4 ${isRefreshingPrices ? 'animate-spin' : ''}`} />
                <span className="ml-1 text-xs">
                  {isRefreshingPrices ? 'Aktualisiere...' : 'Aktualisieren'}
                </span>
              </Button>
            </div>
            
            <TabsContent value="crypto" className="pt-4">
              <div className="space-y-4">
                {cryptoData.map((crypto, index) => (
                  <CryptoItem 
                    key={index}
                    symbol={crypto.symbol} 
                    name={crypto.name} 
                    amount={crypto.amount} 
                    price={crypto.price}
                    value={crypto.value} 
                    change={crypto.change} 
                    iconColor={crypto.iconColor}
                    changeColor={crypto.changeColor}
                    logoUrl={crypto.logoUrl}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="nfts" className="pt-4">
              <div className="text-center py-8 text-gray-400">
                <p>No NFTs found</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <div className="mt-auto border-t border-gray-800">
        <div className="grid grid-cols-4 py-3">
          <NavItem icon={<Home className="h-5 w-5" />} label="Home" active />
          <NavItem icon={<RefreshCcw className="h-5 w-5" />} label="Swap" />
          <NavItem icon={<Compass className="h-5 w-5" />} label="Discover" />
          <NavItem icon={<Globe className="h-5 w-5" />} label="Browser" />
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <button className="flex flex-col items-center justify-center gap-1">
    <div className={`${active ? 'text-wallet-green' : 'text-gray-500'}`}>
      {icon}
    </div>
    <span className={`text-xs ${active ? 'text-white' : 'text-gray-500'}`}>{label}</span>
  </button>
);

const CryptoItem = ({ 
  symbol, 
  name, 
  amount, 
  price,
  value, 
  change, 
  iconColor,
  changeColor,
  logoUrl
}: { 
  symbol: string, 
  name: string, 
  amount: string, 
  price: number,
  value: number, 
  change: string, 
  iconColor: string,
  changeColor: string,
  logoUrl: string
}) => {
  // Format price with commas
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 overflow-hidden`}>
          <img src={logoUrl} alt={symbol} className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="flex items-center">
            <span className="font-medium mr-2">{symbol}</span>
            <span className="text-xs py-0.5 px-2 bg-[#2C3140] text-gray-400 rounded">{name}</span>
          </div>
          <div className="flex items-center mt-1">
            <span className="text-xs text-gray-400">{formattedPrice}</span>
            <span className={`text-xs ${changeColor} ml-2`}>{change}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div>{amount}</div>
        <div className="text-xs text-gray-400 mt-1">
          ${value.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

const WalletView: React.FC = () => {
  return (
    <div className="min-h-screen bg-wallet-darkBg flex justify-center w-full">
      <div className="w-full max-w-md mx-auto min-h-screen shadow-lg bg-wallet-darkBg">
        <WalletProvider>
          <WalletViewContent />
        </WalletProvider>
      </div>
    </div>
  );
};

export default WalletView;
