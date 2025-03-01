
import React from 'react';

interface WalletLogoProps {
  className?: string;
  color?: 'blue' | 'green';
  size?: 'small' | 'medium' | 'large';
}

const WalletLogo: React.FC<WalletLogoProps> = ({ className, color = 'blue', size = 'medium' }) => {
  // Define gradient colors based on the color prop
  const gradientColors = color === 'blue' 
    ? { from: '#0033ff', to: '#00ffaa' }
    : { from: '#4ade80', to: '#22c55e' };
  
  // Determine size based on the size prop
  const sizeClass = size === 'small' ? 'w-8 h-8' : 
                    size === 'large' ? 'w-24 h-24' : 
                    'w-16 h-16'; // medium is default
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className={`${sizeClass} bg-gradient-to-br ${color === 'blue' ? 'from-blue-600 to-blue-400' : 'from-green-500 to-green-400'} rounded-md flex items-center justify-center shadow-lg relative overflow-hidden`}>
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
