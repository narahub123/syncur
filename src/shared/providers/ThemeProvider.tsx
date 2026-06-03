"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";

type ThemeProviderProps = {
  children: ReactNode;
};

/**
 * 전역 테마 Provider.
 *
 * 역할:
 * - 애플리케이션 전체에서 다크 모드/라이트 모드를 관리한다.
 * - next-themes를 통해 테마 상태를 제공한다.
 *
 * 설정:
 * - attribute="class"
 *   - html 요소에 "dark" 클래스를 추가하여 테마를 적용한다.
 *
 * - defaultTheme="system"
 *   - 사용자가 별도로 선택하지 않은 경우 OS 테마를 따른다.
 *
 * - enableSystem
 *   - 시스템 테마(다크/라이트) 연동을 활성화한다.
 */
export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
