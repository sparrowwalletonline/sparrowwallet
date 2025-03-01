
import React from 'react';

interface WalletLogoProps {
  className?: string;
}

const WalletLogo: React.FC<WalletLogoProps> = ({ className }) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="bg-gradient-to-br from-wallet-darkBlue to-wallet-blue w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg mb-2 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_70%)]"></div>
        <svg 
          width="36" 
          height="36" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="text-white"
        >
          <path 
            d="M19 7h-3V5.5A2.5 2.5 0 0 0 13.5 3h-3A2.5 2.5 0 0 0 8 5.5V7H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Zm-9-1.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V7h-4Zm8 12.5h-4v-1h-2v1H8v-4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1Z" 
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
};

export default WalletLogo;
