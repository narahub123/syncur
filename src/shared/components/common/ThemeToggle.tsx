"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/features/settings/apperance/theme/hooks/useTheme";
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
    <button onClick={toggleTheme} className="rounded-full">
      <ResponsiveActionButton
        icon={
          resolvedTheme === "dark" ? (
            <Sun className="text-foreground size-5" />
          ) : (
            <Moon className="text-foreground size-5" />
          )
        }
        label="테마 변경"
      />
    </button>
  );
};
