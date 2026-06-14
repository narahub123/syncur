"use client";

import { useSSE } from "@/features/notifications/hooks/useSSE";
import { SSE_EVENT } from "@/shared/sse/sse-events";
import { NotificationMessageDTO } from "@/features/notifications/dtos/notificationDto";
import { useRouter } from "next/navigation"; // 💡 페이지 이동을 위한 라우터 임포트
import { useMarkNotificationAsReadMutation } from "@/features/admin/notifiactions/hooks/useMarkNotificationAsReadMutation";

export default function AdminSSEProvider() {
  const router = useRouter();

  const { mutate: markAsRead } = useMarkNotificationAsReadMutation();

  useSSE({
    url: "/api/sse/admin",
    eventName: SSE_EVENT.ADMIN_EVENT,
    onEvent: (data: NotificationMessageDTO) => {
      console.log("🔥 관리자 실시간 알림 수신 성공:", data);

      if (Notification.permission === "granted") {
        const notification = new Notification(data.title || "관리자 알림", {
          body: data.message,
          tag: data.id, // 중복 알림 방지용 태그
        });

        // 💡 핵심: 관리자 알림 팝업창 클릭 이벤트 핸들러 추가
        notification.onclick = (event) => {
          event.preventDefault(); // 브라우저 기본 동작 방지
          window.focus(); // 우리 관리자 대시보드 탭을 맨 앞으로 강제 포커싱

          // --- 1. [읽음 처리] Server Action 기반 훅 호출 ---
          // 알림을 클릭하자마자 대시보드 내의 알림 목록이 즉시 읽음 상태로 동기화됩니다.
          if (data.id) {
            markAsRead(data.id);
          }

          // --- 2. [내부 페이지 이동] 요청하신 관리자 에러 로그 상세 페이지로 라우팅 ---
          // 백엔드 크론 서비스가 meta.feedExecutionLogId에 심어준 FeedExecutionLogId를 활용합니다.
          if (data.meta?.feedExecutionLogId) {
            router.push(`/admin/logs/${data.meta.feedExecutionLogId}`);
          } else {
            router.push("/admin/logs");
          }

          // --- 3. [클린업] 클릭 처리가 끝났으므로 화면의 알림 카드 닫기 ---
          notification.close();
        };
      }
    },
  });

  return null;
}
