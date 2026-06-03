"use client";

import { useEffect, useState } from "react";
import {
  applyTheme,
  getStoredTheme,
  setStoredTheme,
  Theme,
} from "@/shared/lib/theme/theme";

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>(() => {
    return getStoredTheme() ?? "system";
  });

  const [mounted, setMounted] = useState(false);

  /**
   * 초기 theme 적용 (state 변경 없음)
   */
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  /**
   * system 모드일 때 OS 변경 감지
   */
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handler = () => {
      const current = getStoredTheme();

      if (current === "system") {
        applyTheme("system");
      }
    };

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  /**
   * 테마 변경
   */
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    setStoredTheme(newTheme);
    applyTheme(newTheme);
  };

  return {
    theme,
    setTheme,
    mounted,
  };
};
