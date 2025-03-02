
import { toast } from '@/components/ui/use-toast';

export interface CryptoPrice {
  symbol: string;
  price: number;
  change_percentage_24h: number;
}

// Function to fetch current prices from CoinGecko API
export const fetchCryptoPrices = async (): Promise<Record<string, CryptoPrice>> => {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,matic-network&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h'
    );
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    
    // Format the data into a more usable structure
    const prices: Record<string, CryptoPrice> = {};
    
    data.forEach((coin: any) => {
      let symbol = '';
      
      // Map the coin IDs to our internal symbols
      switch (coin.id) {
        case 'bitcoin':
          symbol = 'BTC';
          break;
        case 'ethereum':
          symbol = 'ETH';
          break;
        case 'binancecoin':
          symbol = 'BNB';
          break;
        case 'matic-network':
          symbol = 'POL';
          break;
        default:
          return;
      }
      
      prices[symbol] = {
        symbol,
        price: coin.current_price,
        change_percentage_24h: coin.price_change_percentage_24h || 0,
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
      POL: { symbol: 'POL', price: 0.27, change_percentage_24h: 0 },
    };
  }
};
