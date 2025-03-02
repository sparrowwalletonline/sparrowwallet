
import React, { useState, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useMenu } from '@/contexts/MenuContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';
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
    <header className="flex justify-between items-center h-16 px-4 w-full">
      <div className="w-9 h-9 flex items-center justify-center">
        <ThemeToggle />
      </div>
      
      <h1 className="text-lg font-semibold text-foreground flex-1 text-center">{title}</h1>
      
      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full p-0 h-9 w-9 bg-wallet-card"
            >
              <User className="h-5 w-5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover border-border text-popover-foreground">
            <DropdownMenuLabel>Mein Konto</DropdownMenuLabel>
            {username && <DropdownMenuLabel className="font-normal text-sm text-muted-foreground">{username}</DropdownMenuLabel>}
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem 
              className="text-destructive cursor-pointer focus:text-destructive focus:bg-secondary"
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
          <Menu className="h-5 w-5 text-muted-foreground" />
        </Button>
      )}
    </header>
  );
};

export default Header;
