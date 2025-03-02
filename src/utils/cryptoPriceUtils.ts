
import { toast } from '@/components/ui/use-toast';

export interface CryptoPrice {
  symbol: string;
  price: number;
  change_percentage_24h: number;
}

// Function to fetch current prices from CoinGecko API
export const fetchCryptoPrices = async (): Promise<Record<string, CryptoPrice>> => {
  try {
    // Expanded list of cryptocurrencies to fetch
    const cryptoIds = [
      'bitcoin', 'ethereum', 'binancecoin', 'matic-network', 
      'aeternity', 'trustwallet', 'cardano', 'aion', 
      'akash-network', 'algorand', 'aptos', 'cosmos', 'avalanche-2'
    ].join(',');
    
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${cryptoIds}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
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
        case 'aeternity':
          symbol = 'AE';
          break;
        case 'trustwallet':
          symbol = 'TWT';
          break;
        case 'cardano':
          symbol = 'ADA';
          break;
        case 'aion':
          symbol = 'AION';
          break;
        case 'akash-network':
          symbol = 'AKT';
          break;
        case 'algorand':
          symbol = 'ALGO';
          break;
        case 'aptos':
          symbol = 'APT';
          break;
        case 'cosmos':
          symbol = 'ATOM';
          break;
        case 'avalanche-2':
          symbol = 'AVAX';
          break;
        default:
          // Use the coin symbol directly if we don't have a mapping
          symbol = coin.symbol.toUpperCase();
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
      AE: { symbol: 'AE', price: 0.05, change_percentage_24h: 0 },
      TWT: { symbol: 'TWT', price: 1.23, change_percentage_24h: 0 },
      ADA: { symbol: 'ADA', price: 0.59, change_percentage_24h: 0 },
      AION: { symbol: 'AION', price: 0.01, change_percentage_24h: 0 },
      AKT: { symbol: 'AKT', price: 0.31, change_percentage_24h: 0 },
      ALGO: { symbol: 'ALGO', price: 0.15, change_percentage_24h: 0 },
      APT: { symbol: 'APT', price: 7.93, change_percentage_24h: 0 },
      ATOM: { symbol: 'ATOM', price: 8.36, change_percentage_24h: 0 },
      AVAX: { symbol: 'AVAX', price: 25.89, change_percentage_24h: 0 },
    };
  }
};
