
import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

const ManageAssetsButton = () => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-400 hover:text-white transition-all duration-200 rounded-full bg-gray-800/50 hover:bg-gray-700/70 backdrop-blur-sm"
        >
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-900/95 backdrop-blur-md border border-gray-700">
        <DropdownMenuItem 
          onClick={() => navigate('/wallet-choice')}
          className="text-gray-200 hover:text-white focus:text-white hover:bg-gray-800"
        >
          Add New Wallet
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate('/seed-phrase')}
          className="text-gray-200 hover:text-white focus:text-white hover:bg-gray-800"
        >
          Export Seed Phrase
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ManageAssetsButton;
