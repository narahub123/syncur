"use client";

import { useEffect, useState } from "react";

/**
 * 브라우저 Notification 권한 상태 관리 훅
 */
export function useNotificationPermission() {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");

  useEffect(() => {
    if (typeof window === "undefined") return;
    setPermission(Notification.permission);
  }, []);

  // 💡 핵심 추가: 새로고침 없이 리액트 상태를 즉시 업데이트하는 권한 요청 함수
  const requestPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    const result = await Notification.requestPermission();
    setPermission(result); // 💡 상태가 변하는 순간, 이 훅을 쓰는 모든 배너 UI가 실시간으로 바뀝니다.
  };

  return {
    permission,
    requestPermission, // 💡 외부로 함수 노출
    isGranted: permission === "granted",
    isDefault: permission === "default",
    isDenied: permission === "denied",
  };
}
