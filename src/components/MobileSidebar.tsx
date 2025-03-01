
import React, { useEffect } from 'react';
import { useMenu } from '@/contexts/MenuContext';
import { Button } from '@/components/ui/button';
import WalletLogo from '@/components/WalletLogo';
import { Home, Settings, Info, X, ArrowRight } from 'lucide-react';

const MobileSidebar: React.FC = () => {
  const { isMenuOpen, closeMenu } = useMenu();
  
  // Close menu when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('overlay-bg')) {
        closeMenu();
      }
    };
    
    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('click', handleClickOutside);
      // Prevent scrolling when menu is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, closeMenu]);

  console.log('MobileSidebar rendered, isMenuOpen:', isMenuOpen);

  return (
    <>
      {/* Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 overlay-bg bg-black bg-opacity-50 backdrop-blur-sm" />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 z-50 w-[280px] h-full bg-wallet-darkBg transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <WalletLogo className="w-8 h-8" />
              <span className="font-heading text-lg font-bold text-white">Trust Wallet</span>
            </div>
            <button 
              onClick={closeMenu} 
              className="text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex-1 p-6">
            <ul className="space-y-6">
              <li>
                <a href="/" onClick={closeMenu} className="flex items-center gap-3 text-gray-200 hover:text-white">
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Home</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={closeMenu} className="flex items-center gap-3 text-gray-200 hover:text-white">
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={closeMenu} className="flex items-center gap-3 text-gray-200 hover:text-white">
                  <Info className="w-5 h-5" />
                  <span className="font-medium">About</span>
                </a>
              </li>
            </ul>
          </nav>
          
          {/* Call to Action */}
          <div className="p-6 border-t border-gray-800">
            <Button 
              onClick={() => {
                closeMenu();
                window.location.href = "/generate-wallet";
              }} 
              className="w-full py-6 text-base flex items-center justify-center gap-2"
            >
              Create a new wallet <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
