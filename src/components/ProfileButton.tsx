
import React from 'react';
import { UserRound, Shield, CreditCard, Settings, HelpCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useWallet } from '@/contexts/WalletContext';
import { useNavigate } from 'react-router-dom';

const ProfileButton = () => {
  const { logout, session } = useWallet();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Don't show profile menu when not logged in
  if (!session) {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 h-10 w-10 touch-manipulation"
        onClick={() => navigate('/')}
      >
        <UserRound className="h-5 w-5" />
        <span className="sr-only">Anmelden</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 h-10 w-10 touch-manipulation">
          <UserRound className="h-5 w-5" />
          <span className="sr-only">Profil</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="z-[10002] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-800/50 shadow-lg rounded-xl"
      >
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">Konto</p>
          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
            {session?.user?.email || 'Benutzer'}
          </p>
        </div>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => navigate('/profile-settings')}>
          <UserRound className="mr-2 h-4 w-4" />
          Profil Einstellungen
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate('/payment-methods')}>
          <CreditCard className="mr-2 h-4 w-4" />
          Zahlungsmethoden
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate('/security-settings')}>
          <Shield className="mr-2 h-4 w-4" />
          Sicherheitseinstellungen
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate('/app-settings')}>
          <Settings className="mr-2 h-4 w-4" />
          App-Einstellungen
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => navigate('/help-center')}>
          <HelpCircle className="mr-2 h-4 w-4" />
          Hilfe & Support
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate('/about')}>
          <Info className="mr-2 h-4 w-4" />
          Über die App
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout}>
          Abmelden
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileButton;
