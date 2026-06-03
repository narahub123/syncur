"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import Button from "../ui/Button";

export const ThemeToggle = () => {
  const { theme, setTheme, mounted } = useTheme();

  if (!mounted) return null;

  /**
   * light <-> dark 단순 토글
   * system은 settings에서만 관리
   */
  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  return (
    <Button
      variant="outline"
      onClick={toggleTheme}
      className="flex size-12 items-center justify-center rounded-full"
    >
      {theme === "dark" ? (
        <Sun size={30} className="text-foreground" />
      ) : (
        <Moon size={30} className="text-foreground" />
      )}
    </Button>
  );
};
