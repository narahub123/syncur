"use client";

import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * next-themes 기반 테마 훅
 *
 * 역할:
 * - light / dark / system 테마 관리
 * - 실제 적용된 테마(resolvedTheme) 제공
 * - SSR hydration 이후 UI 안전 렌더링 제어(mounted)
 *
 * 주의:
 * - theme은 "사용자 설정 값"
 * - resolvedTheme은 "실제 적용된 값"
 * - systemTheme은 OS 기준 테마
 */
export const useTheme = () => {
  const {
    theme, // 사용자가 설정한 테마 ("light" | "dark" | "system")
    setTheme, // 테마 변경 함수
    resolvedTheme, // 실제 적용된 테마 (system 반영 결과)
    systemTheme, // OS 기준 테마 ("light" | "dark")
  } = useNextTheme();

  /**
   * hydration 완료 여부 상태
   *
   * 이유:
   * - SSR 시 theme 값과 client 초기 값이 다를 수 있음
   * - resolvedTheme이 hydration 이후에 확정되므로
   *   첫 렌더 UI mismatch 방지 필요
   */
  const [mounted, setMounted] = useState(false);

  /**
   * 클라이언트 hydration 완료 시점 감지
   *
   * - true가 되기 전까지는 theme UI 렌더를 지연시켜
   *   SSR / CSR mismatch 방지
   */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    theme, // 사용자 선택 값 (light | dark | system)
    resolvedTheme, // 실제 UI 적용 값 (light | dark)
    systemTheme, // OS 테마 값
    setTheme, // 테마 변경 함수
    mounted, // hydration 완료 여부
  };
};
