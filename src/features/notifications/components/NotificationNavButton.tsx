"use client";

import { useRouter } from "next/navigation";
import { Bell } from "lucide-react"; // 사용하시는 아이콘 라이브러리

import ResponsiveActionButton from "@/shared/components/common/ResponsiveActionButton";
import { useUnreadNotificationCountQuery } from "../hooks/useUnreadNotificationCountQuery";
import { NOTIFICATION_TARGET } from "../constants/notification-target";
import { NOTIFICATION_TYPE } from "../constants/notification-type";

export function NotificationNavButton() {
  const router = useRouter();
  const { data: unreadCount = 0 } = useUnreadNotificationCountQuery(
    NOTIFICATION_TARGET.USER,
    [NOTIFICATION_TYPE.BUG_REPORT_REPLIED, NOTIFICATION_TYPE.INQUIRY_REPLIED],
  );

  return (
    <div className="relative">
      <ResponsiveActionButton
        icon={
          <div className="relative">
            <Bell size={24} />
            {/* 배지 표시 */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
        }
        label="알림"
        onClick={() => router.push("/notifications")}
      />
    </div>
  );
}
