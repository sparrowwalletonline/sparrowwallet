
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface MenuContextType {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  openMenu: () => void;
  closeMenu: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Using a ref to prevent unauthorized actions
  const actionInProgress = useRef(false);

  const toggleMenu = useCallback(() => {
    if (actionInProgress.current) return;
    
    actionInProgress.current = true;
    console.log('Toggle menu called, current state:', isMenuOpen);
    setIsMenuOpen((prev) => !prev);
    
    // Reset action lock after animation completes
    setTimeout(() => {
      actionInProgress.current = false;
    }, 300);
  }, [isMenuOpen]);
  
  const openMenu = useCallback(() => {
    if (actionInProgress.current || isMenuOpen) return;
    
    actionInProgress.current = true;
    console.log('Opening menu');
    setIsMenuOpen(true);
    
    setTimeout(() => {
      actionInProgress.current = false;
    }, 300);
  }, [isMenuOpen]);
  
  const closeMenu = useCallback(() => {
    if (actionInProgress.current || !isMenuOpen) return;
    
    actionInProgress.current = true;
    console.log('Closing menu');
    setIsMenuOpen(false);
    
    setTimeout(() => {
      actionInProgress.current = false;
    }, 300);
  }, [isMenuOpen]);

  return (
    <MenuContext.Provider value={{ isMenuOpen, toggleMenu, openMenu, closeMenu }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = (): MenuContextType => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
