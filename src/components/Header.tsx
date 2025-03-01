
import React from 'react';
import { Bell, Settings, Menu, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useMenu } from '@/contexts/MenuContext';
import { useNavigate } from 'react-router-dom';
import { supabaseClient } from '@/integrations/supabase/client';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { toggleMenu } = useMenu();
  const navigate = useNavigate();
  const [session, setSession] = React.useState<any>(null);

  React.useEffect(() => {
    // Get current session
    const getSession = async () => {
      const { data } = await supabaseClient.auth.getSession();
      setSession(data.session);
    };
    
    getSession();

    // Listen for auth changes
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleMenuClick = () => {
    console.log('Menu button clicked');
    toggleMenu();
  };

  const handleSignOut = async () => {
    await supabaseClient.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully"
    });
    navigate('/');
  };

  return (
    <header className="flex justify-between items-center py-4 px-4 w-full">
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full p-0 h-9 w-9 bg-wallet-card"
        onClick={() => toast({ title: "Settings", description: "Settings not available in demo" })}
      >
        <Settings className="h-5 w-5 text-gray-400" />
      </Button>
      
      <h1 className="text-lg font-semibold text-white">{title}</h1>
      
      <div className="flex items-center gap-2">
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full p-0 h-9 w-9 bg-wallet-card"
              >
                <User className="h-5 w-5 text-emerald-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-wallet-card border-gray-700 text-white">
              <DropdownMenuItem className="text-sm text-gray-300">
                {session.user.email}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-sm cursor-pointer text-red-400 hover:text-red-300 focus:text-red-300"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full p-0 h-9 w-9 bg-wallet-card"
            onClick={() => navigate('/auth')}
          >
            <User className="h-5 w-5 text-gray-400" />
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full p-0 h-9 w-9 bg-wallet-card"
          onClick={handleMenuClick}
        >
          <Menu className="h-5 w-5 text-gray-400" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
