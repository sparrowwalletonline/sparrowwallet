
import React from 'react';
import { Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ThemeToggleProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  variant = 'ghost', 
  size = 'icon',
  className = ''
}) => {
  // In light-only mode, this component is purely decorative
  return (
    <Button
      variant={variant}
      size={size}
      className={`rounded-full ${className}`}
      aria-label="Theme indicator (light mode)"
      disabled
    >
      <Sun className="h-5 w-5 text-yellow-400" />
    </Button>
  );
};

export default ThemeToggle;
