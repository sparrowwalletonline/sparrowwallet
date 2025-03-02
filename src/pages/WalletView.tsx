
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WalletProvider, useWallet } from '@/contexts/WalletContext';
import Header from '@/components/Header';
import WalletBalance from '@/components/WalletBalance';
import WalletActions from '@/components/WalletActions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Home, RefreshCcw, Compass, Globe } from 'lucide-react';

// Inner component that uses the wallet context
const WalletViewContent: React.FC = () => {
  const { hasWallet, btcBalance, btcPrice, ethBalance, ethPrice } = useWallet();
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
  
  // Mock data for BNB and other currencies
  const cryptoData = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      amount: btcBalance.toString(),
      price: btcPrice,
      value: parseFloat(btcValue),
      change: "+1.52%",
      iconColor: "bg-[#F7931A]",
      changeColor: "text-green-500"
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      amount: ethBalance.toString(),
      price: ethPrice,
      value: parseFloat(ethValue),
      change: "-0.12%",
      iconColor: "bg-[#627EEA]",
      changeColor: "text-red-500"
    },
    {
      symbol: "BNB",
      name: "BNB Smart Chain",
      amount: "0.05",
      price: 610.26,
      value: 30.51,
      change: "+2.55%",
      iconColor: "bg-[#F3BA2F]",
      changeColor: "text-green-500"
    },
    {
      symbol: "POL",
      name: "Polygon",
      amount: "20",
      price: 0.27,
      value: 5.40,
      change: "+3.37%",
      iconColor: "bg-[#8247E5]",
      changeColor: "text-green-500"
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

// Wrapper component with provider
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
  changeColor
}: { 
  symbol: string, 
  name: string, 
  amount: string, 
  price: number,
  value: number, 
  change: string, 
  iconColor: string,
  changeColor: string
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
        <div className={`w-8 h-8 ${iconColor} rounded-full flex items-center justify-center mr-3`}>
          <span className="text-xs font-bold text-white">{symbol.charAt(0)}</span>
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

export default WalletView;
