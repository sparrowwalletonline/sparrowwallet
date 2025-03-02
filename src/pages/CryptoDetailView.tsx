
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWallet } from '@/contexts/WalletContext';
import { 
  ChevronLeft, 
  MoreVertical, 
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
import { 
  CryptoPrice, 
  getCryptoDataBySymbol, 
  fallbackCryptoData, 
  fetchCryptoPrices, 
  clearCryptoCache 
} from '@/utils/cryptoPriceUtils';

const getChartImagePath = (symbol: string) => {
  const charts = {
    "BTC": "/lovable-uploads/df7a0e55-4560-436e-ae52-c10510f4b486.png",
    "ETH": "/lovable-uploads/df7a0e55-4560-436e-ae52-c10510f4b486.png",
    "SOL": "/lovable-uploads/df7a0e55-4560-436e-ae52-c10510f4b486.png",
    "BNB": "/lovable-uploads/df7a0e55-4560-436e-ae52-c10510f4b486.png",
  };
  
  return charts[symbol] || "/lovable-uploads/df7a0e55-4560-436e-ae52-c10510f4b486.png";
};

const CryptoDetailView: React.FC = () => {
  const { symbol: urlSymbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const { 
    cryptoPrices: contextCryptoPrices,
    btcBalance, 
    ethBalance, 
    refreshPrices: contextRefreshPrices, 
    isRefreshingPrices: contextIsRefreshing 
  } = useWallet();
  
  const [selectedTimeframe, setSelectedTimeframe] = useState('1T');
  const [isLoading, setIsLoading] = useState(true);
  const [cryptoData, setCryptoData] = useState<CryptoPrice | null>(null);
  const [localPrices, setLocalPrices] = useState<Record<string, CryptoPrice>>(contextCryptoPrices);
  const [isRefreshingPrices, setIsRefreshingPrices] = useState(false);
  
  const symbol = urlSymbol ? urlSymbol.toUpperCase() : '';
  
  // Initial load and when symbol changes
  useEffect(() => {
    if (!symbol) return;
    
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Always fetch fresh prices when viewing details
        const prices = await fetchCryptoPrices();
        setLocalPrices(prices);
        
        // Get data for this specific symbol
        const data = getCryptoDataBySymbol(symbol, prices);
        if (data) {
          console.log("Detail view: Using fresh price data for", symbol, data);
          setCryptoData(data);
        } else {
          console.error("Could not find data for symbol:", symbol);
          const fallback = getCryptoDataBySymbol(symbol, fallbackCryptoData);
          if (fallback) setCryptoData(fallback);
        }
      } catch (error) {
        console.error("Failed to load crypto prices:", error);
        toast({
          variant: "destructive",
          title: "Fehler beim Laden",
          description: "Kryptowährungs-Daten konnten nicht geladen werden."
        });
        
        // Use fallback if fetch fails
        const fallback = getCryptoDataBySymbol(symbol, fallbackCryptoData);
        if (fallback) setCryptoData(fallback);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [symbol]);
  
  // Also update when context prices change
  useEffect(() => {
    if (!symbol) return;
    
    // Update local prices from context
    setLocalPrices(contextCryptoPrices);
    
    // Get data for this specific symbol from updated prices
    const data = getCryptoDataBySymbol(symbol, contextCryptoPrices);
    if (data) {
      console.log("Detail view: Updated from context for", symbol, data);
      setCryptoData(data);
    }
  }, [contextCryptoPrices, symbol]);
  
  const getCryptoBalance = () => {
    if (!symbol) return 0;
    
    if (symbol === 'BTC') return btcBalance;
    if (symbol === 'ETH') return ethBalance;
    
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
  
  const handleRefresh = async () => {
    setIsRefreshingPrices(true);
    setIsLoading(true);
    
    try {
      // Clear the cache to force a fresh fetch
      clearCryptoCache();
      
      // Fetch fresh prices
      const prices = await fetchCryptoPrices();
      setLocalPrices(prices);
      
      // Also update the context
      await contextRefreshPrices();
      
      // Get data for this specific symbol
      if (symbol) {
        const data = getCryptoDataBySymbol(symbol, prices);
        if (data) {
          console.log("Detail view: Manually refreshed data for", symbol, data);
          setCryptoData(data);
        }
      }
      
      toast({
        title: "Daten aktualisiert",
        description: "Die neuesten Preisdaten wurden geladen.",
      });
    } catch (error) {
      console.error("Error refreshing prices:", error);
      toast({
        variant: "destructive",
        title: "Aktualisierung fehlgeschlagen",
        description: "Bitte versuchen Sie es später erneut.",
      });
    } finally {
      setIsRefreshingPrices(false);
      setIsLoading(false);
    }
  };
  
  const now = new Date();
  const formattedDate = formatDate(now);
  
  if (isLoading && !cryptoData) {
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
      <div className="min-h-screen bg-wallet-darkBg text-white flex flex-col items-center justify-center p-4">
        <p className="text-xl mb-2">Crypto nicht gefunden: {symbol}</p>
        <p className="text-sm text-gray-400 mt-2 mb-4">
          Verfügbare Kryptowährungen: {Object.keys(localPrices).join(', ') || Object.keys(fallbackCryptoData).join(', ')}
        </p>
        <p className="text-sm text-gray-400 mb-6">
          Bitte stellen Sie sicher, dass die Kryptowährung verfügbar ist.
        </p>
        <Button variant="wallet" onClick={() => navigate(-1)} className="mt-4">
          Zurück
        </Button>
      </div>
    );
  }

  // Show price with loading state if we're refreshing but have data
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

  const highPrice = price * 1.05;
  const lowPrice = price * 0.95;

  return (
    <div className="min-h-screen bg-wallet-darkBg text-white flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-800">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-lg"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          <span>{cryptoData.name || symbol}</span>
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex flex-col">
          <div className="flex items-center">
            <h1 className="text-4xl font-bold">${price.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1>
            {isLoading && <RefreshCcw className="animate-spin h-4 w-4 ml-2" />}
          </div>
          <div className="flex items-center mt-1">
            <span className={`${changeColor} text-sm mr-2`}>
              {changeFormatted} ({changePercentFormatted})
            </span>
            <span className="text-sm text-gray-400">{formattedDate}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 relative">
        <div className="h-40 w-full relative mb-2 overflow-hidden rounded-lg">
          <img 
            src={getChartImagePath(symbol)} 
            alt="Chart" 
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "center center" }}
          />
          
          <div className="absolute top-2 right-2 text-xs bg-black/50 px-1 rounded">
            ${highPrice.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="absolute bottom-2 left-2 text-xs bg-black/50 px-1 rounded">
            ${lowPrice.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        
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
      
      <div className="grid grid-cols-5 gap-2 px-4 mt-2">
        <CryptoAction icon="buy" label="Kaufen" />
        <CryptoAction icon="swap" label="Swap" />
        <CryptoAction icon="bridge" label="Bridge" />
        <CryptoAction icon="send" label="Senden" />
        <CryptoAction icon="receive" label="Empfangen" />
      </div>
      
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
                  <span>{getCryptoBalance().toString()} {symbol}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className={`text-xs ${cryptoData.change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {cryptoData.change_percentage_24h >= 0 ? '+' : ''}{cryptoData.change_percentage_24h.toFixed(2)}%
                  </span>
                  <span className="text-xs text-gray-400">
                    ${(getCryptoBalance() * cryptoData.price).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
