
import { toast } from '@/components/ui/use-toast';

export interface CryptoPrice {
  symbol: string;
  price: number;
  change_percentage_24h: number;
  image?: string;
  name?: string;
}

// Default fallback data to ensure we always have something to display
export const fallbackCryptoData: Record<string, CryptoPrice> = {
  BTC: { 
    symbol: 'BTC', 
    price: 65872.34, 
    change_percentage_24h: 1.65,
    name: 'Bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
  },
  ETH: { 
    symbol: 'ETH', 
    price: 3452.78, 
    change_percentage_24h: -0.89,
    name: 'Ethereum',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
  },
  BNB: { 
    symbol: 'BNB', 
    price: 608.96, 
    change_percentage_24h: 2.19,
    name: 'Binance Coin',
    image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png'
  },
  SOL: { 
    symbol: 'SOL', 
    price: 150.42, 
    change_percentage_24h: 3.75,
    name: 'Solana',
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png'
  },
  XRP: { 
    symbol: 'XRP', 
    price: 0.5327, 
    change_percentage_24h: -1.25,
    name: 'XRP',
    image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png'
  },
  ADA: { 
    symbol: 'ADA', 
    price: 0.59, 
    change_percentage_24h: 0.85,
    name: 'Cardano',
    image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png'
  },
  DOGE: { 
    symbol: 'DOGE', 
    price: 0.15, 
    change_percentage_24h: 1.45,
    name: 'Dogecoin',
    image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png'
  },
  DOT: { 
    symbol: 'DOT', 
    price: 6.5, 
    change_percentage_24h: -0.35,
    name: 'Polkadot',
    image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png'
  },
  MATIC: { 
    symbol: 'MATIC', 
    price: 0.27, 
    change_percentage_24h: 2.72,
    name: 'Polygon',
    image: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png'
  },
  SHIB: { 
    symbol: 'SHIB', 
    price: 0.00002, 
    change_percentage_24h: 0.53,
    name: 'Shiba Inu',
    image: 'https://assets.coingecko.com/coins/images/11939/large/shiba.png'
  }
};

// Function to fetch current prices from CoinGecko API
export const fetchCryptoPrices = async (): Promise<Record<string, CryptoPrice>> => {
  try {
    // Attempt to fetch top 50 cryptocurrencies by market cap
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h`
    );
    
    if (!response.ok) {
      console.error('API response was not OK:', response.status);
      toast({
        variant: "destructive",
        title: "API-Fehler",
        description: "Verwende Fallback-Daten für Kryptowährungen."
      });
      return fallbackCryptoData;
    }
    
    const data = await response.json();
    
    // If we got empty data, return the fallback
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error('Invalid or empty data received from API');
      return fallbackCryptoData;
    }
    
    // Format the API data into our structure
    const prices: Record<string, CryptoPrice> = {};
    
    data.forEach((coin: any) => {
      const symbol = coin.symbol.toUpperCase();
      
      prices[symbol] = {
        symbol,
        price: coin.current_price,
        change_percentage_24h: coin.price_change_percentage_24h || 0,
        image: coin.image,
        name: coin.name
      };
    });
    
    // Always merge the API data with our fallback data
    // This ensures we have consistent data for the main cryptocurrencies
    const mergedPrices = { ...fallbackCryptoData, ...prices };

    // Let user know prices are updated
    toast({
      title: "Preise aktualisiert",
      description: "Kryptowährungs-Preise erfolgreich aktualisiert.",
    });
    
    console.log("Fetched crypto prices:", mergedPrices);
    return mergedPrices;
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    toast({
      variant: "destructive",
      title: "Fehler beim Laden der Preise",
      description: "Es werden Fallback-Preise angezeigt."
    });
    
    // Return the fallback data
    return fallbackCryptoData;
  }
};

// Helper function to get correct crypto data even if the symbol is not an exact match
export const getCryptoDataBySymbol = (
  symbol: string, 
  cryptoPrices: Record<string, CryptoPrice>
): CryptoPrice | null => {
  if (!symbol) return null;

  // First try direct match
  if (cryptoPrices[symbol]) {
    return cryptoPrices[symbol];
  }
  
  // Then try case-insensitive match
  const normalizedSymbol = symbol.toUpperCase();
  const key = Object.keys(cryptoPrices).find(
    k => k.toUpperCase() === normalizedSymbol
  );
  
  if (key) {
    return cryptoPrices[key];
  }
  
  // If no match in cryptoPrices, check the fallback data
  if (fallbackCryptoData[normalizedSymbol]) {
    return fallbackCryptoData[normalizedSymbol];
  }
  
  return null;
}
