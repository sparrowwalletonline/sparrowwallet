
import { toast } from '@/components/ui/use-toast';

export interface CryptoPrice {
  symbol: string;
  price: number;
  change_percentage_24h: number;
  image?: string;
  name?: string;
}

// Function to fetch current prices from CoinGecko API
export const fetchCryptoPrices = async (): Promise<Record<string, CryptoPrice>> => {
  try {
    // Fetch top 50 cryptocurrencies by market cap
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h`
    );
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    
    // Format the data into a more usable structure
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
    
    return prices;
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    toast({
      variant: "destructive",
      title: "Failed to fetch prices",
      description: "Could not get the latest cryptocurrency prices."
    });
    
    // Return a fallback object with default values
    return {
      BTC: { symbol: 'BTC', price: 40000, change_percentage_24h: 0 },
      ETH: { symbol: 'ETH', price: 2000, change_percentage_24h: 0 },
      BNB: { symbol: 'BNB', price: 610, change_percentage_24h: 0 },
      SOL: { symbol: 'SOL', price: 150, change_percentage_24h: 0 },
      XRP: { symbol: 'XRP', price: 0.5, change_percentage_24h: 0 },
      ADA: { symbol: 'ADA', price: 0.59, change_percentage_24h: 0 },
      DOGE: { symbol: 'DOGE', price: 0.15, change_percentage_24h: 0 },
      DOT: { symbol: 'DOT', price: 6.5, change_percentage_24h: 0 },
      MATIC: { symbol: 'MATIC', price: 0.27, change_percentage_24h: 0 },
      SHIB: { symbol: 'SHIB', price: 0.00002, change_percentage_24h: 0 },
      // Add more default fallbacks for top cryptos
    };
  }
};
