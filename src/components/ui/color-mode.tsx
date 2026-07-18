"use client";

import * as React from "react";
import { ThemeProvider, useTheme } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export type ColorModeProviderProps = ThemeProviderProps;

export function ColorModeProvider(props: ColorModeProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      disableTransitionOnChange
      {...props}
    />
  );
}

export function useColorMode() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleColorMode = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return {
    colorMode: resolvedTheme || "light",
    toggleColorMode,
    setTheme,
  };
}
