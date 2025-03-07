
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

  // Completely rewritten click handler
  const handleCreateWallet = () => {
    console.log("CreateWalletButton clicked");
    
    if (session) {
      // If user is already logged in, go to wallet creation flow
      console.log("User is logged in, navigating to wallet creation");
      navigate('/generate-wallet');
    } else {
      // If not logged in, go to register page first
      console.log("User is not logged in, navigating to register page");
      navigate('/register');
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleCreateWallet}
      type="button"
    >
      {children || "Create Wallet"}
    </Button>
  );
};

export default CreateWalletButton;
