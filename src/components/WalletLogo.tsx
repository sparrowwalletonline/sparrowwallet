
import React from 'react';

interface WalletLogoProps {
  className?: string;
}

const WalletLogo: React.FC<WalletLogoProps> = ({ className }) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="bg-wallet-blue w-16 h-16 rounded-xl flex items-center justify-center shadow-lg mb-4">
        <svg 
          width="32" 
          height="32" 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M18 10L12 16L18 22" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h1 className="text-xl font-bold text-wallet-darkGray">Trust Wallet</h1>
      <p className="text-sm text-wallet-gray">Secure Crypto Wallet</p>
    </div>
  );
};

export default WalletLogo;
