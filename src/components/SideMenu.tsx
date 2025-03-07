import React, { useEffect } from 'react';
import { useMenu } from '@/contexts/MenuContext';
import { Button } from '@/components/ui/button';
import WalletLogo from '@/components/WalletLogo';
import { Home, CreditCard, Settings, X, User, LogOut, Compass, Shield, Gift, HelpCircle, HeartHandshake, Terminal, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useWallet } from '@/contexts/WalletContext';
import ThemeToggle from '@/components/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

const SideMenu: React.FC = () => {
  const { isMenuOpen, closeMenu } = useMenu();
  const navigate = useNavigate();
  const { session, hasWallet, loadFromSupabase } = useWallet();
  
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
    if (path.startsWith('http')) {
      navigate('/browser', { state: { url: path } });
      closeMenu();
      return;
    }
    
    if (path === '/wallet') {
      if (!session) {
        toast({
          title: "Anmeldung erforderlich",
          description: "Du musst angemeldet sein, um auf deine Wallet zuzugreifen",
          variant: "default"
        });
        navigate('/auth');
      } else {
        if (hasWallet) {
          navigate('/wallet');
        } else {
          const walletLoaded = await loadFromSupabase();
          
          if (walletLoaded) {
            navigate('/wallet');
          } else {
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

  const menuVariants = {
    closed: { 
      x: "100%", 
      opacity: 1,
      transition: { 
        type: "tween", 
        duration: 0.25,
        ease: [0.33, 1, 0.68, 1]
      }
    },
    open: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "tween", 
        duration: 0.25,
        ease: [0.33, 1, 0.68, 1],
        staggerChildren: 0.03,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    closed: { 
      x: 10,
      opacity: 0 
    },
    open: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "tween",
        duration: 0.2
      }
    }
  };

  const overlayVariants = {
    closed: { 
      opacity: 0,
      transition: { duration: 0.2 }
    },
    open: { 
      opacity: 1,
      transition: { duration: 0.2 }
    }
  };

  const MenuItem = ({ icon: Icon, title, path }: { icon: any, title: string, path: string }) => (
    <motion.li variants={itemVariants}>
      <div 
        className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
        onClick={() => handleNavigation(path)}
      >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{title}</span>
      </div>
    </motion.li>
  );

  const MenuSection = ({ title, items }: { title: string, items: Array<{icon: any, title: string, path: string}> }) => (
    <div className="mb-6">
      <h3 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold mb-2 px-3">{title}</h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <MenuItem key={item.title} icon={item.icon} title={item.title} path={item.path} />
        ))}
      </ul>
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      {isMenuOpen && (
        <>
          <motion.div 
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 z-50 overlay-bg bg-black bg-opacity-50 backdrop-blur-sm menu-overlay"
            onClick={closeMenu}
          />
          
          <motion.div 
            className="fixed top-0 right-0 z-[51] w-[300px] h-full bg-white dark:bg-wallet-darkBg rounded-l-xl shadow-xl menu-content"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <WalletLogo className="w-8 h-8" />
                  <span className="font-semibold text-lg">Sparrow Wallet</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <motion.button 
                    onClick={closeMenu} 
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
              
              <nav className="flex-1 p-5 overflow-y-auto">
                <MenuSection 
                  title="Main" 
                  items={[
                    { icon: Home, title: "Home", path: "/" },
                    { icon: CreditCard, title: "Wallet", path: "/wallet" },
                    { icon: Shield, title: "Security", path: "/security-settings" }
                  ]} 
                />
                
                <MenuSection 
                  title="Resources" 
                  items={[
                    { icon: Gift, title: "Features", path: "/features" },
                    { icon: FileText, title: "Documentation", path: "/documentation" },
                    { icon: HelpCircle, title: "Support", path: "/support" },
                    { icon: Terminal, title: "GitHub", path: "https://github.com/sparrowwallet/sparrow" }
                  ]} 
                />
                
                <MenuSection 
                  title="Account" 
                  items={[
                    { icon: User, title: "Profile", path: "/auth" },
                    { icon: HeartHandshake, title: "Donate", path: "/donate" },
                    { icon: Settings, title: "Settings", path: "/terms" }
                  ]} 
                />
              </nav>
              
              <motion.div 
                className="p-5 border-t border-gray-200 dark:border-gray-800"
                variants={itemVariants}
              >
                {session ? (
                  <Button 
                    variant="destructive" 
                    className="w-full justify-start rounded-lg" 
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    <span>Sign Out</span>
                  </Button>
                ) : (
                  <Button 
                    variant="default" 
                    className="w-full justify-start rounded-lg" 
                    onClick={() => handleNavigation('/auth')}
                  >
                    <User className="h-5 w-5 mr-2" />
                    <span>Sign In</span>
                  </Button>
                )}
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideMenu;
