
import React, { useState, useEffect } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from './ui/theme-provider';

interface ChartDataPoint {
  date: string;
  value: number;
}

interface AnalyticsChartProps {
  tokens: {
    symbol: string;
    name: string;
    iconColor: string;
    logoUrl?: string;
    price: number;
  }[];
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ tokens }) => {
  const [currentTokenIndex, setCurrentTokenIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const { theme } = useTheme();
  
  // Check if device is mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const currentToken = tokens[currentTokenIndex];
  
  // Generate some dummy data for the chart
  const generateChartData = (token: typeof tokens[0]): ChartDataPoint[] => {
    // Use the actual current price as the base value
    const baseValue = token.price;
    const volatility = baseValue * 0.05; // 5% volatility based on the actual price
    
    const data: ChartDataPoint[] = [];
    const now = new Date();
    
    // Adjust number of data points based on screen size
    const dataPoints = isMobile ? 15 : 30;
    
    for (let i = dataPoints; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Create some random but somewhat realistic price movements
      const randomFactor = 0.5 + Math.random();
      const trendFactor = Math.sin(i / 5) * 0.3 + 0.7;
      const value = baseValue + (volatility * randomFactor * trendFactor) - (volatility / 2);
      
      data.push({
        date: date.toLocaleDateString('de-DE', { month: 'short', day: 'numeric' }),
        value: parseFloat(value.toFixed(2))
      });
    }
    
    return data;
  };
  
  const chartData = currentToken ? generateChartData(currentToken) : [];
  
  const handlePrevToken = () => {
    setCurrentTokenIndex(prevIndex => 
      prevIndex > 0 ? prevIndex - 1 : tokens.length - 1
    );
  };
  
  const handleNextToken = () => {
    setCurrentTokenIndex(prevIndex => 
      prevIndex < tokens.length - 1 ? prevIndex + 1 : 0
    );
  };
  
  // Swipe handling for mobile
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 70) {
      // Swipe left, go to next token
      handleNextToken();
    }
    
    if (touchEnd - touchStart > 70) {
      // Swipe right, go to previous token
      handlePrevToken();
    }
  };
  
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  const chartColor = currentToken?.symbol === 'BTC' ? '#F7931A' : 
                    currentToken?.symbol === 'ETH' ? '#627EEA' : 
                    currentToken?.symbol === 'BNB' ? '#F3BA2F' :
                    currentToken?.symbol === 'MATIC' || currentToken?.symbol === 'POL' ? '#8247E5' : 
                    '#4ade80';
  
  if (!currentToken || tokens.length === 0) return null;
  
  return (
    <div className="mt-4 md:mt-6 animate-fade-in">
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <h3 className="text-xs sm:text-sm font-medium">Kursverlauf: {currentToken.name}</h3>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 md:h-8 md:w-8 p-0"
            onClick={handlePrevToken}
            aria-label="Previous token"
          >
            <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 md:h-8 md:w-8 p-0"
            onClick={handleNextToken}
            aria-label="Next token"
          >
            <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center overflow-hidden">
          {currentToken.logoUrl ? (
            <img src={currentToken.logoUrl} alt={currentToken.symbol} className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full ${currentToken.iconColor} flex items-center justify-center`}>
              <span className="text-xs text-white font-bold">{currentToken.symbol.substring(0, 2)}</span>
            </div>
          )}
        </div>
        <div>
          <div className="text-base md:text-lg font-medium">{formatPrice(currentToken.price)}</div>
          <div className="text-xs text-gray-400">30 Tage</div>
        </div>
      </div>
      
      <div 
        className="h-[150px] sm:h-[180px] w-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ 
              top: 5, 
              right: isMobile ? 0 : 5, 
              left: isMobile ? 0 : 5, 
              bottom: 5 
            }}
          >
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              tick={{ 
                fontSize: isMobile ? 8 : 10, 
                fill: theme === 'dark' ? '#9ca3af' : '#6b7280' 
              }}
              axisLine={false}
              tickLine={false}
              interval={isMobile ? 'preserveStartEnd' : "preserveStartEnd"}
              minTickGap={isMobile ? 15 : 30}
              height={isMobile ? 20 : 30}
            />
            <YAxis 
              hide 
              domain={['dataMin - 100', 'dataMax + 100']} 
            />
            <Tooltip 
              formatter={(value: number) => [formatPrice(value), 'Preis']}
              labelFormatter={(label) => `Datum: ${label}`}
              contentStyle={{ 
                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                color: theme === 'dark' ? '#f9fafb' : '#111827',
                fontSize: isMobile ? '12px' : '14px',
                padding: isMobile ? '8px' : '10px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={chartColor} 
              fillOpacity={1}
              fill="url(#colorGradient)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {isMobile && (
        <div className="text-xs text-center text-muted-foreground mt-2">
          Wische nach links oder rechts, um zwischen Tokens zu wechseln
        </div>
      )}
    </div>
  );
};

export default AnalyticsChart;
