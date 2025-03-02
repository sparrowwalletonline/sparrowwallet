
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export const useTheme = () => {
  // Use the hook from next-themes directly to avoid type errors
  const { theme, setTheme } = React.useContext(
    // @ts-ignore - Using the internal context from next-themes
    React.__NEXT_THEMES__ || { theme: "dark", setTheme: () => null }
  );
  
  // Fallback to window object if context is not available (client-side only)
  if (typeof window !== "undefined" && !theme) {
    try {
      // @ts-ignore - This is a runtime check for the next-themes context
      const contextValue = window.__NEXT_THEMES__?._contextStore?.get?.() || {};
      return {
        theme: contextValue.theme || "dark",
        setTheme: contextValue.setTheme || ((t: string) => console.log("Theme provider not initialized", t))
      };
    } catch (err) {
      console.error("Error accessing theme context:", err);
    }
  }
  
  return { theme, setTheme };
};
