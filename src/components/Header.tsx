
import React from 'react';
import { ArrowLeft, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMenu } from '@/contexts/MenuContext';
import { useWallet } from '@/contexts/WalletContext';
import ThemeToggle from './ThemeToggle';
import ManageAssetsButton from './ManageAssetsButton';
import WalletInfoButton from './WalletInfoButton';
import TutorialMenu from './TutorialMenu';
import ProfileButton from './ProfileButton';
import { useTutorial } from '@/contexts/TutorialContext';

const Header = ({ 
  title, 
  showBack = false, 
  showSettings = false, 
  className = "", 
  showMenuToggle = false, 
  showWalletInfo = false, 
  showTutorial = false,
  showProfileButton = true
}: { 
  title: string; 
  showBack?: boolean; 
  showSettings?: boolean; 
  className?: string;
  showMenuToggle?: boolean;
  showWalletInfo?: boolean;
  showTutorial?: boolean;
  showProfileButton?: boolean;
}) => {
  const navigate = useNavigate();
  const { toggleMenu } = useMenu();
  const { activeWallet } = useWallet();

  const BackButton = () => (
    <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center">
      <ArrowLeft className="w-5 h-5" />
    </button>
  );

  return (
    <header className={`flex items-center justify-between py-3 px-4 wallet-header z-[9999] bg-white/95 dark:bg-black/90 backdrop-blur-md shadow-xl border-b border-gray-100 dark:border-gray-800 ${className}`}>
      <div className="flex items-center gap-2">
        {showBack && (
          <BackButton />
        )}
        
        {showMenuToggle && (
          <button onClick={toggleMenu} className="w-8 h-8 flex items-center justify-center">
            <Menu className="w-5 h-5" />
          </button>
        )}
        
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/311d7952-d195-4eb5-8b1a-17ed65abc660.png" 
            alt="Sparrow Logo" 
            className="w-7 h-7 object-contain" 
          />
          <h1 className="text-xl font-bold leading-tight">Sparrow Wallet</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {showTutorial && (
          <TutorialMenu />
        )}
        
        {showWalletInfo && activeWallet && (
          <div className="flex items-center">
            <WalletInfoButton />
          </div>
        )}
        
        {showSettings && (
          <ManageAssetsButton />
        )}
        
        {showProfileButton && <ThemeToggle />}
        {showProfileButton && <ProfileButton />}
      </div>
    </header>
  );
}

export default Header;
