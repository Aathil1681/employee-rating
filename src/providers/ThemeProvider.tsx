"use client";

import { useSetInitialTheme, useTheme } from "@/stores/themeStore";
import { cn } from "@/utilities/cn";
import { ReactNode } from "react";

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { colorScheme } = useSetInitialTheme();
  const { mode } = useTheme();

  if (!colorScheme) return null;

  return (
    <div
      className={cn("flex h-full w-full flex-1 flex-col", {
        dark: mode === "system" && colorScheme && colorScheme.matches,
        light: mode === "system" && colorScheme && !colorScheme.matches,
        [mode]: mode !== "system",
      })}
    >
      {children}
    </div>
  );
};

export default ThemeProvider;
