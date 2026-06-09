"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/features/settings/apperance/theme/hooks/useTheme";
import { Button } from "../ui/button";
import ResponsiveActionButton from "./ResponsiveActionButton";

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
      variant="ghost"
      onClick={toggleTheme}
      className="h-12 w-full rounded-none"
    >
      <ResponsiveActionButton
        icon={
          resolvedTheme === "dark" ? (
            <Sun size={30} className="text-foreground" />
          ) : (
            <Moon size={30} className="text-foreground" />
          )
        }
        label="테마 변경"
      />
    </Button>
  );
};
