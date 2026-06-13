"use client";

import { useNotificationPermission } from "../hooks/useNotificationPermission";

/**
 * Notification 활성 상태 표시 UI (옵션)
 *
 * 역할:
 * - 현재 알림 상태를 UI로 표시
 * - admin dashboard에서 상태 확인용
 */
export default function NotificationStatusIndicator() {
  const { isGranted, isDenied, isDefault } = useNotificationPermission();

  return (
    <div className="text-xs text-gray-500">
      알림 상태: {isGranted && "활성"}
      {isDefault && "미설정"}
      {isDenied && "차단됨"}
    </div>
  );
}
