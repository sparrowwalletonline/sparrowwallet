
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Always set defaultTheme prop to "light" to ensure light mode by default
  const updatedProps = {
    ...props,
    defaultTheme: "light",
    enableSystem: false, // Disable system theme detection to force light mode
    disableTransitionOnChange: false, // Smoother transitions
  };
  
  React.useEffect(() => {
    // Force light theme application on initial load
    const applyTheme = () => {
      document.documentElement.setAttribute('data-theme', 'light');
      // Ensure class is also set for Tailwind
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    };
    
    applyTheme();
    window.addEventListener('storage', applyTheme);
    
    return () => {
      window.removeEventListener('storage', applyTheme);
    };
  }, []);
  
  return <NextThemesProvider {...updatedProps}>{children}</NextThemesProvider>
}

export const useTheme = () => {
  // Use the useTheme hook directly from next-themes package
  const themeContext = useNextTheme();
  
  React.useEffect(() => {
    // Ensure theme changes are applied immediately
    if (themeContext.theme) {
      document.documentElement.setAttribute('data-theme', themeContext.theme);
      // Ensure class is also set for Tailwind
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(themeContext.theme);
    }
  }, [themeContext.theme]);
  
  return themeContext;
}
