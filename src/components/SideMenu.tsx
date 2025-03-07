
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
      opacity: 1, // Changed from 0 to 1 to prevent flicker
      transition: { 
        type: "tween", // Changed from "spring" to "tween"
        duration: 0.25,
        ease: [0.33, 1, 0.68, 1] // Smoother easing
      }
    },
    open: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "tween", // Changed from "spring" to "tween"
        duration: 0.25,
        ease: [0.33, 1, 0.68, 1], // Smoother easing
        staggerChildren: 0.03,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    closed: { 
      x: 10, // Reduced from 20 to 10
      opacity: 0 
    },
    open: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "tween", // Changed from "spring" to "tween"
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
            className="fixed top-0 right-0 z-[51] w-[280px] h-full bg-white dark:bg-wallet-darkBg shadow-xl menu-content"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
                <WalletLogo className="w-8 h-8" />
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <motion.button 
                    onClick={closeMenu} 
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                    whileHover={{ scale: 1.05 }} // Reduced from 1.1
                    whileTap={{ scale: 0.97 }} // Changed from 0.95
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>
              
              <nav className="flex-1 p-6 overflow-y-auto">
                <div className="mb-6">
                  <h3 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold mb-3">Main</h3>
                  <ul className="space-y-4">
                    <motion.li variants={itemVariants}>
                      <div 
                        className="flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white cursor-pointer menu-item"
                        onClick={() => handleNavigation('/')}
                      >
                        <Home className="w-5 h-5" />
                        <span className="font-medium">Home</span>
                      </div>
                    </motion.li>
                    <motion.li variants={itemVariants}>
                      <div 
                        className="flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white cursor-pointer menu-item"
                        onClick={() => handleNavigation('/wallet')}
                      >
                        <CreditCard className="w-5 h-5" />
                        <span className="font-medium">Wallet</span>
                      </div>
                    </motion.li>
                    <motion.li variants={itemVariants}>
                      <div 
                        className="flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white cursor-pointer menu-item"
                        onClick={() => handleNavigation('/security-settings')}
                      >
                        <Shield className="w-5 h-5" />
                        <span className="font-medium">Security</span>
                      </div>
                    </motion.li>
                  </ul>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold mb-3">Resources</h3>
                  <ul className="space-y-4">
                    <motion.li variants={itemVariants}>
                      <div 
                        className="flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white cursor-pointer menu-item"
                        onClick={() => handleNavigation('/features')}
                      >
                        <Gift className="w-5 h-5" />
                        <span className="font-medium">Features</span>
                      </div>
                    </motion.li>
                    <motion.li variants={itemVariants}>
                      <div 
                        className="flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white cursor-pointer menu-item"
                        onClick={() => handleNavigation('/documentation')}
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">Documentation</span>
                      </div>
                    </motion.li>
                    <motion.li variants={itemVariants}>
                      <div 
                        className="flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white cursor-pointer menu-item"
                        onClick={() => handleNavigation('/support')}
                      >
                        <HelpCircle className="w-5 h-5" />
                        <span className="font-medium">Support</span>
                      </div>
                    </motion.li>
                    <motion.li variants={itemVariants}>
                      <div 
                        className="flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white cursor-pointer menu-item"
                        onClick={() => handleNavigation('https://github.com/sparrowwallet/sparrow')}
                      >
                        <Terminal className="w-5 h-5" />
                        <span className="font-medium">GitHub</span>
                      </div>
                    </motion.li>
                  </ul>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold mb-3">Account</h3>
                  <ul className="space-y-4">
                    <motion.li variants={itemVariants}>
                      <div 
                        className="flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white cursor-pointer menu-item"
                        onClick={() => handleNavigation('/auth')}
                      >
                        <User className="w-5 h-5" />
                        <span className="font-medium">Profile</span>
                      </div>
                    </motion.li>
                    <motion.li variants={itemVariants}>
                      <div 
                        className="flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white cursor-pointer menu-item"
                        onClick={() => handleNavigation('/donate')}
                      >
                        <HeartHandshake className="w-5 h-5" />
                        <span className="font-medium">Donate</span>
                      </div>
                    </motion.li>
                    <motion.li variants={itemVariants}>
                      <div 
                        className="flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white cursor-pointer menu-item"
                        onClick={() => handleNavigation('/terms')}
                      >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Settings</span>
                      </div>
                    </motion.li>
                  </ul>
                </div>
              </nav>
              
              <motion.div 
                className="p-6 border-t border-gray-200 dark:border-gray-800"
                variants={itemVariants}
              >
                {session ? (
                  <Button 
                    variant="destructive" 
                    className="w-full justify-start" 
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    <span>Sign Out</span>
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => handleNavigation('/auth')}
                  >
                    <User className="h-5 w-5 mr-3" />
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
