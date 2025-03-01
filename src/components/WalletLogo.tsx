
import React from 'react';

interface WalletLogoProps {
  className?: string;
}

const WalletLogo: React.FC<WalletLogoProps> = ({ className }) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="bg-gradient-to-br from-wallet-darkBlue to-wallet-blue w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg mb-2 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_70%)]"></div>
        <img 
          src="https://trustwallet.com/favicon.ico" 
          alt="Trusty Wallet Logo" 
          className="w-12 h-12" 
        />
      </div>
    </div>
  );
};

export default WalletLogo;
