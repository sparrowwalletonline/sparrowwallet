
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@/contexts/WalletContext';

interface CreateWalletButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
}

const CreateWalletButton = ({ 
  variant = 'default',
  size = 'default', 
  className = '',
  children
}: CreateWalletButtonProps) => {
  const navigate = useNavigate();
  const { session } = useWallet();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any default form submission
    
    if (session) {
      // If user is already logged in, go to wallet creation flow
      navigate('/generate-wallet');
    } else {
      // If not logged in, go to register page first
      navigate('/register');
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
      type="button" // Explicitly set type to button to prevent form submission
    >
      {children || "Create Wallet"}
    </Button>
  );
};

export default CreateWalletButton;
