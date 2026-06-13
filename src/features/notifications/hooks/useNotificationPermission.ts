"use client";

import { useEffect, useState } from "react";

/**
 * 브라우저 Notification 권한 상태 관리 훅
 *
 * 역할:
 * - permission 상태 추적
 * - UI에서 알림 허용 여부 판단 기준 제공
 */
export function useNotificationPermission() {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");

  useEffect(() => {
    if (typeof window === "undefined") return;

    setPermission(Notification.permission);
  }, []);

  return {
    permission,
    isGranted: permission === "granted",
    isDefault: permission === "default",
    isDenied: permission === "denied",
  };
}
