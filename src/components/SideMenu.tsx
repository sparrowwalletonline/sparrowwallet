
import React, { useEffect } from 'react';
import { useMenu } from '@/contexts/MenuContext';
import { Button } from '@/components/ui/button';
import WalletLogo from '@/components/WalletLogo';
import { Home, CreditCard, Settings, X, User, LogOut, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useWallet } from '@/contexts/WalletContext';

const SideMenu: React.FC = () => {
  const { isMenuOpen, closeMenu } = useMenu();
  const navigate = useNavigate();
  const { session, hasWallet, loadFromSupabase } = useWallet();
  
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

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({ 
        title: "Abgemeldet", 
        description: "Du wurdest erfolgreich abgemeldet" 
      });
      closeMenu();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({ 
        title: "Fehler", 
        description: "Beim Abmelden ist ein Fehler aufgetreten", 
        variant: "destructive" 
      });
    }
  };

  const handleNavigation = async (path: string) => {
    // For external links, use the browser view
    if (path.startsWith('http')) {
      navigate('/browser', { state: { url: path } });
      closeMenu();
      return;
    }
    
    // For wallet route, check if the user is authenticated first
    if (path === '/wallet') {
      if (!session) {
        toast({
          title: "Anmeldung erforderlich",
          description: "Du musst angemeldet sein, um auf deine Wallet zuzugreifen",
          variant: "default"
        });
        navigate('/auth');
      } else {
        // User is authenticated, check if they have a wallet
        if (hasWallet) {
          navigate('/wallet');
        } else {
          // Try to load wallet from Supabase
          const walletLoaded = await loadFromSupabase();
          
          if (walletLoaded) {
            navigate('/wallet');
          } else {
            // Redirect to wallet creation flow
            toast({
              title: "Keine Wallet gefunden",
              description: "Erstelle deine erste Wallet",
              variant: "default"
            });
            navigate('/wallet-choice');
          }
        }
      }
    } else {
      navigate(path);
    }
    closeMenu();
  };

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
                <div 
                  className="flex items-center gap-3 text-gray-200 hover:text-white cursor-pointer"
                  onClick={() => handleNavigation('/')}
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Start</span>
                </div>
              </li>
              <li>
                <div 
                  className="flex items-center gap-3 text-gray-200 hover:text-white cursor-pointer"
                  onClick={() => handleNavigation('/wallet')}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="font-medium">Wallet</span>
                </div>
              </li>
              <li>
                <div 
                  className="flex items-center gap-3 text-gray-200 hover:text-white cursor-pointer"
                  onClick={() => handleNavigation('https://www.coindesk.com/')}
                >
                  <Compass className="w-5 h-5" />
                  <span className="font-medium">Discover</span>
                </div>
              </li>
              <li>
                <div 
                  className="flex items-center gap-3 text-gray-200 hover:text-white cursor-pointer"
                  onClick={() => handleNavigation('/auth')}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Konto</span>
                </div>
              </li>
              <li>
                <div 
                  className="flex items-center gap-3 text-gray-200 hover:text-white cursor-pointer"
                  onClick={() => handleNavigation('/terms')}
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Einstellungen</span>
                </div>
              </li>
            </ul>
          </nav>
          
          {/* Sign Out Button */}
          <div className="p-6 border-t border-gray-800">
            {session ? (
              <Button 
                variant="destructive" 
                className="w-full justify-start" 
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span>Abmelden</span>
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => handleNavigation('/auth')}
              >
                <User className="h-5 w-5 mr-3" />
                <span>Anmelden</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
