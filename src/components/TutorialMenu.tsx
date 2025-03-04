
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTutorial } from '@/contexts/TutorialContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { HelpCircle, PlayCircle, CheckCircle2 } from 'lucide-react';

const TutorialMenu: React.FC = () => {
  const { startTutorial, hasCompletedTutorials } = useTutorial();

  const tutorialOptions = [
    { id: 'walletIntro', name: 'Wallet Introduction' },
    { id: 'sendCrypto', name: 'Sending Crypto' }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">Help & Tutorials</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm font-semibold">Tutorials</div>
        <DropdownMenuSeparator />
        {tutorialOptions.map(tutorial => (
          <DropdownMenuItem 
            key={tutorial.id}
            onClick={() => startTutorial(tutorial.id)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <PlayCircle className="h-4 w-4 text-blue-600" />
              <span>{tutorial.name}</span>
            </div>
            {hasCompletedTutorials.includes(tutorial.id) && (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TutorialMenu;
