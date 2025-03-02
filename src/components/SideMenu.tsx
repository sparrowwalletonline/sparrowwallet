
import React from 'react';
import { useMenu } from '@/contexts/MenuContext';
import { X, Home, CreditCard, Settings, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const SideMenu: React.FC = () => {
  const { isMenuOpen, closeMenu } = useMenu();
  const navigate = useNavigate();

  if (!isMenuOpen) return null;

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

  const handleNavigation = (path: string) => {
    navigate(path);
    closeMenu();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="w-64 h-full bg-wallet-darkBg text-white overflow-y-auto shadow-lg transform transition-transform duration-300 ease-in-out">
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-xl font-semibold">Menü</h2>
          <Button variant="ghost" size="icon" onClick={closeMenu}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="p-4">
          <nav className="space-y-3">
            <div 
              className="flex items-center p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
              onClick={() => handleNavigation('/')}
            >
              <Home className="h-5 w-5 mr-3" />
              <span>Start</span>
            </div>
            
            <div 
              className="flex items-center p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
              onClick={() => handleNavigation('/wallet')}
            >
              <CreditCard className="h-5 w-5 mr-3" />
              <span>Wallet</span>
            </div>
            
            <div 
              className="flex items-center p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
              onClick={() => handleNavigation('/auth')}
            >
              <User className="h-5 w-5 mr-3" />
              <span>Konto</span>
            </div>
            
            <div 
              className="flex items-center p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
              onClick={() => handleNavigation('/terms')}
            >
              <Settings className="h-5 w-5 mr-3" />
              <span>Einstellungen</span>
            </div>
          </nav>
          
          <div className="mt-8 pt-4 border-t border-gray-700">
            <Button 
              variant="destructive" 
              className="w-full justify-start" 
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Abmelden</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
