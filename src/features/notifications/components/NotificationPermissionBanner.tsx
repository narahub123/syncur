"use client";

import { useNotificationPermission } from "../hooks/useNotificationPermission";

/**
 * Notification 권한 요청 UI
 *
 * 역할:
 * - default 상태에서 사용자에게 권한 요청 유도
 */
export default function NotificationPermissionBanner() {
  const { permission, isDefault } = useNotificationPermission();

  if (!isDefault) return null;

  const handleRequest = async () => {
    await Notification.requestPermission();
    window.location.reload(); // 상태 동기화 (간단 처리)
  };

  return (
    <div className="flex justify-between bg-blue-100 p-3 text-sm">
      <span>실시간 장애 알림을 받으려면 브라우저 알림을 허용해주세요.</span>

      <button onClick={handleRequest} className="font-bold">
        허용하기
      </button>
    </div>
  );
}
