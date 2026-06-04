"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/features/settings/apperance/theme/hooks/useTheme";
import { Button } from "../ui/button";

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme, mounted } = useTheme();

  if (!mounted) return null;

  /**
   * light <-> dark 단순 토글
   * system은 settings에서만 관리
   */
  const toggleTheme = () => {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  return (
    <Button
      variant="outline"
      onClick={toggleTheme}
      className="flex size-12 items-center justify-center rounded-full"
    >
      {resolvedTheme === "dark" ? (
        <Sun size={30} className="text-foreground" />
      ) : (
        <Moon size={30} className="text-foreground" />
      )}
    </Button>
  );
};
