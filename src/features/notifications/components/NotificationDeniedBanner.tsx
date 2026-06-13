"use client";

import { useNotificationPermission } from "../hooks/useNotificationPermission";

/**
 * Notification denied 상태 안내 UI
 *
 * 역할:
 * - 사용자가 이미 차단한 경우 안내
 * - 브라우저 설정 유도
 */
export default function NotificationDeniedBanner() {
  const { isDenied } = useNotificationPermission();

  if (!isDenied) return null;

  return (
    <div className="bg-red-100 p-3 text-sm">
      브라우저 알림이 차단되어 있습니다.
      <br />
      설정에서 알림을 허용해주세요.
    </div>
  );
}
