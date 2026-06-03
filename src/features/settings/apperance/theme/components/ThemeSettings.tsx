"use client";

import { useTheme } from "@/features/settings/apperance/theme/hooks/useTheme";
import { THEME_OPTIONS } from "../constansts/theme";

export const ThemeSettings = () => {
  const { theme, setTheme, mounted } = useTheme();

  if (!mounted) return null;

  return (
    <div className="space-y-2 p-3">
      <p className="font-medium">테마 설정</p>
      {THEME_OPTIONS.map((option) => {
        const Icon = option.icon;
        const isActive = theme === option.value;

        return (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={`flex w-full items-center gap-3 rounded-xl border p-4 transition ${
              isActive
                ? "border-primary bg-primary/10"
                : "border-border hover:bg-muted"
            } `}
          >
            <Icon
              className={isActive ? "text-primary" : "text-muted-foreground"}
              size={22}
            />

            <div className="text-left">
              <div className="font-medium">{option.label}</div>
              <div className="text-muted-foreground text-sm">{option.desc}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
