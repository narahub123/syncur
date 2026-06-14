"use client";

import { useSSE } from "@/features/notifications/hooks/useSSE";
import { SSE_EVENT } from "@/shared/sse/sse-events";
import { NotificationMessageDTO } from "@/features/notifications/dtos/notificationDto";
import { useMarkNotificationAsReadMutation } from "@/features/admin/notifiactions/hooks/useMarkNotificationAsReadMutation";
import { useRouter } from "next/navigation";

export default function UserSSEProvider() {
  const router = useRouter();

  const { mutate: markAsRead } = useMarkNotificationAsReadMutation();

  useSSE({
    url: "/api/sse/user",
    eventName: SSE_EVENT.USER_EVENT,
    onEvent: (data: NotificationMessageDTO) => {
      console.log("🔥 유저 실시간 알림 수신 성공:", data);

      if (Notification.permission === "granted") {
        const notification = new Notification(data.title || "새로운 알림", {
          body: data.message,
          tag: data.id, // 중복 알림 방지용 태그
        });

        // 💡 알림 팝업창 클릭 이벤트 핸들러
        notification.onclick = (event) => {
          event.preventDefault();
          window.focus(); // 우리 사이트 브라우저 탭을 맨 앞으로 포커싱

          // --- 1. [💡 읽음 처리] 제공해주신 Server Action 기반 뮤테이션 훅 호출 ---
          // data.id (알림 ID)를 넘겨주면 낙관적 업데이트와 함께 DB 상태가 즉시 바뀝니다.
          if (data.id) {
            markAsRead(data.id);
          }

          // --- 2. [원문 이동] 백엔드가 전해준 originUrl을 활용해 새 탭으로 오픈 ---
          if (data.meta?.originUrl) {
            // 💡 A. 외부 주소가 있다면 기존과 동일하게 새 탭(_blank)으로 원문 오픈
            window.open(data.meta.originUrl, "_blank");
          } else {
            // 💡 B. 원문 주소가 없다면, 새 창을 열지 않고 현재 열려 있는 우리 사이트 창 내부에서 이동!
            // 프로젝트의 실제 피드 목록 주소 규칙에 맞게 경로를 지정하세요. (예: 피드 홈 "/" 또는 "/feeds")
            console.warn("⚠️ 메타데이터에 originUrl 주소가 누락되었습니다.");
            router.push("/feeds");
          }

          // --- 3. [클린업] 클릭했으므로 화면 알림 카드 닫기 ---
          notification.close();
        };
      }
    },
  });

  return null;
}
