
import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="flex justify-between items-center py-4 px-1 w-full">
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full"
        onClick={() => toast({ title: "Menu", description: "Menu not available in demo" })}
      >
        <Menu className="h-5 w-5 text-wallet-darkGray" />
      </Button>
      
      <h1 className="text-lg font-semibold">{title}</h1>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full"
        onClick={() => toast({ title: "Notifications", description: "No new notifications" })}
      >
        <Bell className="h-5 w-5 text-wallet-darkGray" />
      </Button>
    </header>
  );
};

export default Header;
