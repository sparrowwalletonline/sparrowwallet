import React, { useState, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useMenu } from '@/contexts/MenuContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from 'lucide-react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { toggleMenu } = useMenu();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Check for the current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        // Fetch the user's profile
        fetchProfile(session.user.id);
      }
    });

    // Listen for authentication changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setUsername(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleMenuClick = () => {
    console.log('Menu button clicked');
    toggleMenu();
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({ 
        title: "Abgemeldet", 
        description: "Du wurdest erfolgreich abgemeldet" 
      });
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

  return (
    <header className="flex justify-between items-center py-4 px-4 w-full">
      <div className="w-9"></div> {/* Empty div for spacing to maintain alignment */}
      
      <h1 className="text-lg font-semibold text-white">{title}</h1>
      
      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full p-0 h-9 w-9 bg-wallet-card"
            >
              <User className="h-5 w-5 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-wallet-darkBg border-gray-700 text-white">
            <DropdownMenuLabel>Mein Konto</DropdownMenuLabel>
            {username && <DropdownMenuLabel className="font-normal text-sm text-gray-400">{username}</DropdownMenuLabel>}
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem 
              className="text-red-500 cursor-pointer focus:text-red-500 focus:bg-gray-800"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Abmelden</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full p-0 h-9 w-9 bg-wallet-card"
          onClick={handleMenuClick}
        >
          <Menu className="h-5 w-5 text-gray-400" />
        </Button>
      )}
    </header>
  );
};

export default Header;
