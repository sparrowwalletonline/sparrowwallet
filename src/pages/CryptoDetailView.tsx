
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWallet } from '@/contexts/WalletContext';
import { 
  ChevronLeft, 
  MoreVertical, 
  LineChart,
  RefreshCcw, 
  ArrowUp,
  ArrowDown,
  CornerUpRight,
  QrCode
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from '@/components/ui/use-toast';

// Create a helper function to get chart image path based on symbol
const getChartImagePath = (symbol: string) => {
  // Default to BNB chart for the demo
  return "/lovable-uploads/df7a0e55-4560-436e-ae52-c10510f4b486.png";
};

const CryptoDetailView: React.FC = () => {
  const { symbol: urlSymbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const { 
    cryptoPrices, 
    btcBalance, 
    ethBalance, 
    refreshPrices, 
    isRefreshingPrices 
  } = useWallet();
  
  const [selectedTimeframe, setSelectedTimeframe] = useState('1T');
  const [isLoading, setIsLoading] = useState(true);
  
  // Normalize symbol to uppercase for consistent comparison
  const symbol = urlSymbol ? urlSymbol.toUpperCase() : '';
  
  // Find the crypto data using symbol matching
  const getCryptoData = () => {
    if (!symbol || Object.keys(cryptoPrices).length === 0) return null;
    
    // First try direct match
    if (cryptoPrices[symbol]) {
      return cryptoPrices[symbol];
    }
    
    // If no direct match, try case-insensitive matching
    for (const key of Object.keys(cryptoPrices)) {
      if (key.toUpperCase() === symbol.toUpperCase()) {
        return cryptoPrices[key];
      }
    }
    
    // If still no match, use a fallback for demo purposes
    if (symbol === 'BNB' && !cryptoPrices['BNB']) {
      return {
        symbol: 'BNB',
        price: 608.96,
        change_percentage_24h: 2.19,
        image: null,
        name: 'Binance Coin'
      };
    }
    
    if (symbol === 'BTC' && !cryptoPrices['BTC']) {
      return {
        symbol: 'BTC',
        price: 65872.34,
        change_percentage_24h: 1.65,
        image: null,
        name: 'Bitcoin'
      };
    }
    
    if (symbol === 'ETH' && !cryptoPrices['ETH']) {
      return {
        symbol: 'ETH',
        price: 3452.78,
        change_percentage_24h: -0.89,
        image: null,
        name: 'Ethereum'
      };
    }
    
    return null;
  };
  
  const cryptoData = getCryptoData();
  
  console.log("Symbol from URL (normalized):", symbol);
  console.log("Available cryptoPrices:", Object.keys(cryptoPrices));
  console.log("Crypto data found:", cryptoData);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // If prices aren't loaded yet, refresh them
        if (Object.keys(cryptoPrices).length === 0) {
          await refreshPrices();
        }
      } catch (error) {
        console.error("Failed to load crypto prices:", error);
        toast({
          variant: "destructive",
          title: "Fehler beim Laden",
          description: "Kryptowährungs-Daten konnten nicht geladen werden."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [refreshPrices]);
  
  const getCryptoBalance = () => {
    if (!symbol) return 0;
    
    if (symbol === 'BTC') return btcBalance;
    if (symbol === 'ETH') return ethBalance;
    if (symbol === 'BNB') return 0; // Demo value
    return 0;
  };
  
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('de-DE', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleRefresh = () => {
    refreshPrices();
  };
  
  // Get the current timestamp for display
  const now = new Date();
  const formattedDate = formatDate(now);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-wallet-darkBg text-white flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <RefreshCcw className="animate-spin h-8 w-8 mb-4" />
          <p>Lade Kryptowährungs-Daten...</p>
        </div>
      </div>
    );
  }
  
  if (!cryptoData) {
    return (
      <div className="min-h-screen bg-wallet-darkBg text-white flex flex-col items-center justify-center">
        <p>Crypto nicht gefunden: {symbol}</p>
        <p className="text-sm text-gray-400 mt-2">Verfügbare Kryptowährungen: {Object.keys(cryptoPrices).join(', ')}</p>
        <Button variant="wallet" onClick={() => navigate(-1)} className="mt-4">
          Zurück
        </Button>
      </div>
    );
  }

  const price = cryptoData.price;
  const changeAmount = (cryptoData.change_percentage_24h / 100) * price;
  const changeFormatted = changeAmount >= 0 ? 
    `+${changeAmount.toFixed(2)}` : 
    changeAmount.toFixed(2);
  const changePercentFormatted = cryptoData.change_percentage_24h >= 0 ? 
    `+${cryptoData.change_percentage_24h.toFixed(2)}%` : 
    `${cryptoData.change_percentage_24h.toFixed(2)}%`;
  const changeColor = cryptoData.change_percentage_24h >= 0 ? 
    "text-green-500" : 
    "text-red-500";
  
  const balance = getCryptoBalance();
  const balanceValue = balance * price;

  return (
    <div className="min-h-screen bg-wallet-darkBg text-white flex flex-col">
      {/* Header with back button and crypto name */}
      <div className="flex justify-between items-center p-4 border-b border-gray-800">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-lg"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          <span>{symbol}</span>
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
      
      {/* Price info */}
      <div className="p-4">
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold">${price.toFixed(2)}</h1>
          <div className="flex items-center mt-1">
            <span className={`${changeColor} text-sm mr-2`}>
              {changeFormatted} ({changePercentFormatted})
            </span>
            <span className="text-sm text-gray-400">{formattedDate}</span>
          </div>
        </div>
      </div>
      
      {/* Price Chart */}
      <div className="p-4 relative">
        <div className="h-40 w-full relative mb-2 overflow-hidden rounded-lg">
          <img 
            src={getChartImagePath(symbol)} 
            alt="Chart" 
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "center center" }}
          />
          
          {/* Chart price markers */}
          <div className="absolute top-2 right-2 text-xs bg-black/50 px-1 rounded">
            $611.05
          </div>
          <div className="absolute bottom-2 left-2 text-xs bg-black/50 px-1 rounded">
            $591.08
          </div>
        </div>
        
        {/* Timeframe tabs */}
        <Tabs 
          defaultValue="1T" 
          value={selectedTimeframe}
          onValueChange={setSelectedTimeframe}
          className="w-full"
        >
          <div className="flex justify-between items-center">
            <TabsList className="grid grid-cols-5 bg-gray-800 rounded-full h-8 p-1">
              <TabsTrigger 
                value="1T" 
                className="rounded-full text-xs h-6 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
              >
                1T
              </TabsTrigger>
              <TabsTrigger 
                value="1W" 
                className="rounded-full text-xs h-6 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
              >
                1W
              </TabsTrigger>
              <TabsTrigger 
                value="1M" 
                className="rounded-full text-xs h-6 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
              >
                1M
              </TabsTrigger>
              <TabsTrigger 
                value="3M" 
                className="rounded-full text-xs h-6 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
              >
                3M
              </TabsTrigger>
              <TabsTrigger 
                value="Alle" 
                className="rounded-full text-xs h-6 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
              >
                Alle
              </TabsTrigger>
            </TabsList>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
              onClick={handleRefresh}
              disabled={isRefreshingPrices}
            >
              <RefreshCcw className={`h-4 w-4 ${isRefreshingPrices ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </Tabs>
      </div>
      
      {/* Actions */}
      <div className="grid grid-cols-5 gap-2 px-4 mt-2">
        <CryptoAction icon="buy" label="Kaufen u." />
        <CryptoAction icon="swap" label="Swap" />
        <CryptoAction icon="bridge" label="Bridge" />
        <CryptoAction icon="send" label="Senden" />
        <CryptoAction icon="receive" label="Empfangen" />
      </div>
      
      {/* Account balance */}
      <div className="px-4 mt-8">
        <h2 className="text-xl font-bold mb-4">Ihr Kontostand</h2>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                {cryptoData.image ? (
                  <img src={cryptoData.image} alt={symbol} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full bg-blue-500 flex items-center justify-center`}>
                    <span className="text-xs text-white font-bold">{symbol?.substring(0, 2)}</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{symbol}</span>
                  <span>{balance.toString()} {symbol}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className={`text-xs ${changeColor}`}>
                    {changePercentFormatted}
                  </span>
                  <span className="text-xs text-gray-400">
                    ${balanceValue.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const CryptoAction = ({ icon, label }: { icon: string, label: string }) => {
  const getIcon = () => {
    switch(icon) {
      case 'send':
        return <ArrowUp className="h-5 w-5" />;
      case 'receive':
        return <ArrowDown className="h-5 w-5" />;
      case 'buy':
        return (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4V20M12 4L6 10M12 4L18 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'swap':
        return <RefreshCcw className="h-5 w-5" />;
      case 'bridge':
        return <CornerUpRight className="h-5 w-5" />;
      default:
        return <QrCode className="h-5 w-5" />;
    }
  };
  
  return (
    <button className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mb-1">
        {getIcon()}
      </div>
      <span className="text-xs">{label}</span>
    </button>
  );
};

export default CryptoDetailView;
