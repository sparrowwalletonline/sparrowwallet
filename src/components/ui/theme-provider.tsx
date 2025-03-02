
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export const useTheme = () => {
  const { theme, setTheme } = React.useContext(
    // @ts-ignore - ThemeContext is not exported from next-themes
    // but it exists in the DOM, so we can use it this way
    window.__NEXT_THEMES__._contextStore.get() || { theme: "dark", setTheme: () => null }
  );
  return { theme, setTheme };
};
