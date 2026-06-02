"use client";

import { Toaster } from "sonner";

/**
 * 전역 토스트 UI를 렌더링한다.
 *
 * 사용 예:
 * - 성공 알림
 * - 에러 알림
 * - 경고 알림
 * - 정보 알림
 *
 * RootLayout에 한 번만 등록하여
 * 애플리케이션 어디에서든 toast를 사용할 수 있다.
 */
export default function AppToaster() {
  /**
   * richColors:
   * - 토스트 유형에 따라 기본 색상을 적용한다.
   * - success: 초록색
   * - error: 빨간색
   * - warning: 노란색
   * - info: 파란색
   */
  return <Toaster richColors />;
}
