import { NotificationMessageDTO } from "@/features/notifications/dtos/notificationDto";
import { adminClients, userClients } from "./sse-registry";
import { SSE_EVENT } from "./sse-events";

const encoder = new TextEncoder();

export function broadcastUser(data: NotificationMessageDTO) {
  // 💡 유저 브로드캐스트에도 어드민과 동일하게 강력한 시각적 로그 박스 추가
  console.log("========================================");
  console.log("🚨 [USER SSE BROADCAST] broadcastUser 함수 실행됨!");
  console.log(
    "👥 현재 메모리에 등록된 유저 커넥션 수(size):",
    userClients.size,
  );
  console.log("📦 발송 데이터 제목:", data.title);
  console.log("========================================");

  const payload = encoder.encode(
    `event: ${SSE_EVENT.USER_EVENT}\ndata: ${JSON.stringify(data)}\n\n`,
  );

  for (const controller of userClients) {
    try {
      controller.enqueue(payload);
    } catch (error) {
      console.error(
        "❌ User 클라이언트 전송 실패 (이미 닫힌 스트림 제거):",
        error,
      );
      userClients.delete(controller);
    }
  }
}

export function broadcastAdmin(data: NotificationMessageDTO) {
  console.log("========================================");
  console.log("🚨 [ADMIN SSE BROADCAST] broadcastAdmin 함수 실행됨!");
  console.log(
    "👥 현재 메모리에 등록된 어드민 커넥션 수(size):",
    adminClients.size,
  );
  console.log("📦 발송 데이터 제목:", data.title);
  console.log("========================================");

  const payload = encoder.encode(
    `event: ${SSE_EVENT.ADMIN_EVENT}\ndata: ${JSON.stringify(data)}\n\n`,
  );

  for (const controller of adminClients) {
    try {
      controller.enqueue(payload);
    } catch (error) {
      console.error(
        "❌ Admin 클라이언트 전송 실패 (이미 닫힌 스트림 제거):",
        error,
      );
      adminClients.delete(controller);
    }
  }
}
