
import React from 'react';
import { Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
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
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full p-0 h-9 w-9 bg-wallet-card"
        onClick={() => toast({ title: "Notifications", description: "No new notifications" })}
      >
        <Bell className="h-5 w-5 text-gray-400" />
      </Button>
    </header>
  );
};

export default Header;
