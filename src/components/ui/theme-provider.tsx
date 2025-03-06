
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Force light theme
  const updatedProps = {
    ...props,
    defaultTheme: "light",
    forcedTheme: "light", // Force light theme, never allow switching
    enableSystem: false, // Disable system theme detection
    disableTransitionOnChange: false, // Keep smooth transitions
  };
  
  return <NextThemesProvider {...updatedProps}>{children}</NextThemesProvider>
}

export const useTheme = () => {
  // Since we're forcing light mode, this hook is simplified
  const [theme, setTheme] = React.useState('light');
  
  // Return a dummy theme object that always reports light mode
  return {
    theme: 'light',
    setTheme: () => {}, // No-op function since theme can't be changed
    systemTheme: 'light',
    themes: ['light'],
    forcedTheme: 'light',
  };
}
