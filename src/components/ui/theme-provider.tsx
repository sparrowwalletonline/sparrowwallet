
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Set defaultTheme prop to "light" if not provided
  const updatedProps = {
    ...props,
    defaultTheme: props.defaultTheme || "light",
    enableSystem: true, // Enable system theme detection
    disableTransitionOnChange: false, // Smoother transitions
  };
  
  React.useEffect(() => {
    // Force theme application on mobile by setting a data attribute
    const applyTheme = () => {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        document.documentElement.setAttribute('data-theme', storedTheme);
        // Ensure class is also set for Tailwind
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(storedTheme);
      }
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
    // Ensure theme changes are applied immediately on mobile
    if (themeContext.theme) {
      localStorage.setItem('theme', themeContext.theme);
      document.documentElement.setAttribute('data-theme', themeContext.theme);
      // Ensure class is also set for Tailwind
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(themeContext.theme);
    }
  }, [themeContext.theme]);
  
  return themeContext;
}
