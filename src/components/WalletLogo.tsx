
import React from 'react';

interface WalletLogoProps {
  className?: string;
  color?: 'blue' | 'green' | 'sparrow';
  useSparrowLogo?: boolean;
  scale?: number;
  animate?: boolean;
}

const WalletLogo: React.FC<WalletLogoProps> = ({ 
  className, 
  color = 'sparrow', 
  useSparrowLogo = true,
  scale = 1,
  animate = false
}) => {
  // If using the sparrow logo, return the image without background
  if (useSparrowLogo) {
    return (
      <div 
        className={`relative ${className} ${animate ? 'animate-bounce-slow' : ''}`} 
        style={scale !== 1 ? { transform: `scale(${scale})` } : undefined}
      >
        <img 
          src="/lovable-uploads/b5ad3bc7-c93f-4658-9622-34dfaed25653.png" 
          alt="Sparrow Logo" 
          className="w-full h-full object-contain z-10"
        />
      </div>
    );
  }
  
  // Define gradient colors based on the color prop
  const gradientColors = color === 'blue' 
    ? { from: '#0033ff', to: '#00ffaa' }
    : color === 'sparrow' 
      ? { from: '#8E9196', to: '#403E43' }
      : { from: '#4ade80', to: '#22c55e' };
  
  const bgClass = color === 'blue' 
    ? 'from-blue-600 to-blue-400' 
    : color === 'sparrow'
      ? 'from-gray-500 to-gray-700'
      : 'from-green-500 to-green-400';
  
  return (
    <div className={`flex items-center ${className} ${animate ? 'animate-bounce-slow' : ''}`}>
      <div className={`bg-gradient-to-br ${bgClass} rounded-md flex items-center justify-center shadow-lg relative overflow-hidden`}>
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full"
        >
          <path
            d="M50 0 L100 25 L100 75 L50 100 L0 75 L0 25 Z"
            fill="url(#logo-gradient)"
          />
          <defs>
            <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradientColors.from} />
              <stop offset="100%" stopColor={gradientColors.to} />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default WalletLogo;
