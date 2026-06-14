"use client";

import { useEffect, useRef, useState } from "react";
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

  const hasMarkedRef = useRef(false);

  // 💡 시각적으로 부드럽게 사라지는 애니메이션 트리거용 상태 변수 추가
  const [isClosing, setIsClosing] = useState(false);

  /**
   * 💡 애니메이션과 함께 안전하게 읽음 처리하는 공통 함수
   */
  const handleMarkAsReadWithAnimation = () => {
    if (hasMarkedRef.current) return;

    // 1. 애니메이션 트리거 클래스를 먼저 켭니다.
    setIsClosing(true);
    hasMarkedRef.current = true;

    // 2. CSS 트랜지션 애니메이션 시간(300ms)이 끝난 후 진짜 백엔드 뮤테이션을 실행합니다.
    // 이렇게 처리해야 UI가 부드럽게 닫힌 후 데이터 카운트가 0으로 동기화됩니다.
    setTimeout(() => {
      markAllRead();
    }, 300);
  };

  /**
   * 클릭 → 즉시 읽음 처리 및 닫기
   */
  const handleClick = () => {
    if (unreadCount > 0) {
      handleMarkAsReadWithAnimation();
    }
  };

  /**
   * 스크롤 → 최초 1회만 읽음 처리 및 닫기
   */
  useEffect(() => {
    const handleScroll = () => {
      if (hasMarkedRef.current) return;
      if (unreadCount === 0) return;
      if (window.scrollY > 200) {
        handleMarkAsReadWithAnimation();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [unreadCount]); // 💡 불필요한 markAllRead 참조를 제거해 의존성 최적화

  // 💡 안심 가드: 카운트가 원래 0이고 닫히는 중도 아니라면 DOM 트리에서 완전 제외
  if (unreadCount === 0 && !isClosing) return null;

  return (
    <button
      onClick={handleClick}
      // 💡 Tailwind CSS의 max-height와 opacity, transition 속성을 활용해 자연스러운 슬라이드 업 효과 구현
      className={`hover:bg-accent flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden border-b border-gray-100 py-1 text-center transition-all duration-300 ease-in-out ${isClosing ? "max-h-0 border-none py-0 opacity-0" : "max-h-12 opacity-100"} `}
    >
      <p className="text-xs font-medium text-blue-600">
        {`확인하지 않은 게시물이 ${unreadCount}개 존재합니다`}
      </p>
      <X size={12} className="text-gray-400" />
    </button>
  );
};

export default UnreadFeedIndicator;
