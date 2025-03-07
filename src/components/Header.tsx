
import React from 'react';
import { ArrowLeft, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMenu } from '@/contexts/MenuContext';
import { useWallet } from '@/contexts/WalletContext';
import ThemeToggle from './ThemeToggle';
import ManageAssetsButton from './ManageAssetsButton';
import WalletInfoButton from './WalletInfoButton';
import TutorialMenu from './TutorialMenu';
import ProfileButton from './ProfileButton';
import { useTutorial } from '@/contexts/TutorialContext';
import WalletLogo from './WalletLogo';

const Header = ({ 
  title = "Sparrow", 
  showBack = false, 
  showSettings = false, 
  className = "", 
  showMenuToggle = true,
  showWalletInfo = false, 
  showTutorial = false,
  showProfileButton = true
}: { 
  title?: string; 
  showBack?: boolean; 
  showSettings?: boolean; 
  className?: string;
  showMenuToggle?: boolean;
  showWalletInfo?: boolean;
  showTutorial?: boolean;
  showProfileButton?: boolean;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleMenu } = useMenu();
  const { activeWallet } = useWallet();

  // Don't show header on specific routes
  const hideHeaderRoutes = ['/terms', '/passphrase', '/seed-phrase', '/seed-phrase-validation', '/register'];
  if (hideHeaderRoutes.includes(location.pathname)) {
    return null;
  }

  // Hide menu toggle on wallet page
  const isWalletPage = location.pathname === '/wallet' || location.pathname.startsWith('/wallet/');
  const shouldShowMenuToggle = showMenuToggle && !isWalletPage;

  const BackButton = () => (
    <button 
      onClick={() => navigate(-1)} 
      className="w-10 h-10 flex items-center justify-center rounded-full bg-white/70 hover:bg-white/90 backdrop-blur-sm dark:bg-gray-800/50 dark:hover:bg-gray-800/70 transition-all shadow-sm hover:shadow-md"
    >
      <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
    </button>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] px-4 py-3 pb-6 flex justify-center">
      <header className={`flex items-center justify-between py-2.5 px-4 rounded-2xl bg-white/85 dark:bg-black/70 backdrop-blur-md border border-gray-200/50 dark:border-gray-800/50 shadow-lg w-full max-w-5xl ${className}`}>
        <div className="flex items-center gap-3">
          {showBack && (
            <BackButton />
          )}
          
          {shouldShowMenuToggle && (
            <button 
              onClick={toggleMenu} 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/70 hover:bg-white/90 backdrop-blur-sm dark:bg-gray-800/50 dark:hover:bg-gray-800/70 transition-all shadow-sm hover:shadow-md"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </button>
          )}
          
          {title && (
            <h1 className="text-lg font-medium text-gray-800 dark:text-gray-100">{title}</h1>
          )}
        </div>
        
        <div className="flex items-center gap-3">
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
          <WalletLogo useSparrowLogo={true} className="w-8 h-8 ml-2" />
        </div>
      </header>
    </div>
  );
}

export default Header;
