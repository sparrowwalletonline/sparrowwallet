
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Set defaultTheme prop to "light" if not provided
  const updatedProps = {
    ...props,
    defaultTheme: props.defaultTheme || "light",
  };
  return <NextThemesProvider {...updatedProps}>{children}</NextThemesProvider>
}

export const useTheme = () => {
  // Use the useTheme hook directly from next-themes package
  return useNextTheme();
}
