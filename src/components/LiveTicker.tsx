
import React, { useEffect, useState, useRef } from 'react';
import { fetchCryptoPrices, CryptoPrice } from '@/utils/cryptoPriceUtils';
import { TrendingUp, TrendingDown } from 'lucide-react';

const LiveTicker = () => {
  const [cryptoData, setCryptoData] = useState<Record<string, CryptoPrice>>({});
  const [isLoading, setIsLoading] = useState(true);
  const tickerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Top cryptocurrencies to display in the ticker
  const topCryptos = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'DOGE', 'DOT', 'MATIC', 'SHIB'];
  
  useEffect(() => {
    // Initial fetch
    fetchPrices();
    
    // Set up interval for regular updates
    const interval = setInterval(fetchPrices, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Simple horizontal scrolling effect
  useEffect(() => {
    if (isLoading || !tickerRef.current) return;
    
    const ticker = tickerRef.current;
    
    const animateScroll = () => {
      // For smoother scrolling on iOS
      if ('ontouchstart' in window) {
        // Manual scroll method for iOS
        if (ticker && ticker.scrollWidth > ticker.clientWidth) {
          setScrollPosition(prev => {
            const newPos = prev + 1;
            if (newPos >= ticker.scrollWidth / 2) {
              return 0;
            }
            return newPos;
          });
        }
      } else {
        // Standard animation for desktop
        if (ticker && ticker.scrollWidth > ticker.clientWidth) {
          setScrollPosition(prev => {
            const newPos = prev + 1;
            if (newPos >= ticker.scrollWidth / 2) {
              return 0;
            }
            return newPos;
          });
        }
      }
    };
    
    // Apply scroll position
    if (ticker) {
      ticker.scrollLeft = scrollPosition;
    }
    
    const animation = setInterval(animateScroll, 30);
    
    return () => clearInterval(animation);
  }, [isLoading, scrollPosition]);
  
  const fetchPrices = async () => {
    try {
      const data = await fetchCryptoPrices();
      setCryptoData(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching crypto prices for ticker:', error);
    }
  };
  
  // Format price for display
  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return price.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
    } else if (price >= 1) {
      return price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } else {
      return price.toLocaleString(undefined, {
        minimumFractionDigits: 4,
        maximumFractionDigits: 6
      });
    }
  };
  
  // If still loading, show a placeholder
  if (isLoading) {
    return (
      <div className="ticker-background text-[#1A1F2C] dark:text-gray-200 py-2 overflow-hidden border-b border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
        <div className="flex items-center justify-center">
          <span className="text-xs animate-pulse">Loading crypto prices...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="ticker-background text-[#1A1F2C] dark:text-gray-200 py-2 overflow-hidden border-b border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm z-50 sticky top-0">
      <div 
        ref={tickerRef} 
        className="flex overflow-x-auto whitespace-nowrap ticker-scroll"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Duplicate the items for smooth infinite scroll */}
        {[...topCryptos, ...topCryptos].map((symbol, index) => {
          const crypto = cryptoData[symbol];
          if (!crypto) return null;
          
          const change = crypto.change_percentage_24h;
          const isPositive = change >= 0;
          
          return (
            <div 
              key={`${symbol}-${index}`} 
              className="flex items-center mx-3 first:ml-2 last:mr-2 py-1"
            >
              {crypto.image && (
                <img 
                  src={crypto.image} 
                  alt={crypto.name || symbol} 
                  className="w-5 h-5 mr-2 rounded-full"
                />
              )}
              <span 
                className={`flex items-center text-xs font-medium ${
                  isPositive ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {Math.abs(change).toFixed(2)}%
              </span>
              <span className="ml-2 text-xs font-medium">${formatPrice(crypto.price)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveTicker;
