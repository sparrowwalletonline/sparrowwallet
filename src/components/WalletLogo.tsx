
import React from 'react';

interface WalletLogoProps {
  className?: string;
}

const WalletLogo: React.FC<WalletLogoProps> = ({ className }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="bg-gradient-to-br from-blue-600 to-blue-400 rounded-md flex items-center justify-center shadow-lg relative overflow-hidden">
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
              <stop offset="0%" stopColor="#0033ff" />
              <stop offset="100%" stopColor="#00ffaa" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default WalletLogo;
