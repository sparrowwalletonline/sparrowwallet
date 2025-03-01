import React from 'react';

interface WalletLogoProps {
  className?: string;
}

const WalletLogo: React.FC<WalletLogoProps> = ({ className }) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
    </div>
  );
};

export default WalletLogo;
