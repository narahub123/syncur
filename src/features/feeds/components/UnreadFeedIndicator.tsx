"use client";

import { useEffect, useRef } from "react";
import { NOTIFICATION_TARGET } from "@/features/notifications/constants/notification-target";
import { useUnreadNotificationCountQuery } from "@/features/notifications/hooks/useUnreadNotificationCountQuery";

import { X } from "lucide-react";
import { useMarkAllNotificationsAsReadMutation } from "@/features/admin/notifiactions/hooks/useMarkAllNotificationsAsReadMutation";

const UnreadFeedIndicator = () => {
  const { data: unreadCount = 0 } = useUnreadNotificationCountQuery(
    NOTIFICATION_TARGET.USER,
  );

  const { mutate: markAllRead } = useMarkAllNotificationsAsReadMutation(
    NOTIFICATION_TARGET.USER,
  );

  /**
   * 스크롤 기반 중복 호출 방지
   */
  const hasMarkedRef = useRef(false);

  /**
   * 클릭 → 즉시 읽음 처리
   */
  const handleClick = () => {
    if (unreadCount > 0) {
      markAllRead();
      hasMarkedRef.current = true;
    }
  };

  /**
   * 스크롤 → 최초 1회만 읽음 처리
   */
  useEffect(() => {
    const handleScroll = () => {
      if (hasMarkedRef.current) return;
      if (unreadCount === 0) return;

      if (window.scrollY > 200) {
        markAllRead();
        hasMarkedRef.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [unreadCount, markAllRead]);

  if (unreadCount === 0) return null;

  return (
    <button
      onClick={handleClick}
      className="hover:bg-accent flex w-full cursor-pointer items-center justify-center gap-2 border-b border-gray-100 py-1"
    >
      <p className="text-center">
        {`확인하지 않은 게시물이 ${unreadCount}개 존재합니다`}
      </p>
      <X size={12} />
    </button>
  );
};

export default UnreadFeedIndicator;
