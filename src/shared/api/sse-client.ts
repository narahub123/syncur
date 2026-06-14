// @/shared/api/sse-client.ts
import { NotificationTarget } from "@/features/notifications/constants/notification-target";
import { NotificationType } from "@/features/notifications/constants/notification-type";
import { NotificationMessageDTO } from "@/features/notifications/dtos/notificationDto";
import { NotificationDocument } from "@/features/notifications/model/notification";
import { NotificationMetadata } from "@/features/notifications/types";

interface BulkSseParams {
  url: string; // API_ROUTES.SSE.USER 또는 ADMIN
  savedNotifications: NotificationDocument[]; // DB에서 나온 알림 문서 배열
  target: NotificationTarget; // NOTIFICATION_TARGET.USER 또는 ADMIN
  type: NotificationType; // NOTIFICATION_TYPE.NEW_FEED_ITEM 등
  channelName: string; // 로그 식별용 (예: "유저 피드", "어드민 에러")
  extraMeta?: NotificationMetadata; // 에러 알림 등에서 params로 넘겨받는 추가 메타데이터
}

/**
 * 1. [단건 전송] 웹 서버 프로세스로 알림 대행 요청 전송 (기존 유지)
 */
async function triggerSseNotification(
  url: string,
  payload: NotificationMessageDTO,
  channelName: string,
): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (err) {
    console.error(`❌ [${channelName}] 네트워크 브릿지 호출 실패:`, err);
    return false;
  }
}

/**
 * 2. 💡 [일괄 가공 및 전송]
 * DB 저장 결과(savedNotifications)를 받아 유효성 체크, 개행문자 치환, payload 조립 후 루프 전송을 통째로 대행
 */
export async function sendBulkSseNotifications({
  url,
  savedNotifications,
  target,
  type,
  channelName,
  extraMeta = {},
}: BulkSseParams): Promise<void> {
  if (!savedNotifications || !savedNotifications.length) return;

  console.log(
    `📢 [${channelName}] 대규모 알림 중계 시작 (대상: ${savedNotifications.length}개)`,
  );

  for (const n of savedNotifications) {
    try {
      if (!n) continue;

      // 1) 프로토콜 안정성을 위해 줄바꿈(\n)을 기호로 강제 치환
      const safeMessage = (n.message || "").replace(/\n/g, " | ");

      // 2) 어떤 형태의 알림이든 대응할 수 있도록 통합 메타데이터 객체 조립
      const integratedMeta = {
        feedId: n.metadata?.feedId?.toString() || extraMeta.feedId,
        feedItemId: n.metadata?.feedItemId?.toString() || extraMeta.feedItemId,
        siteId: n.metadata?.siteId?.toString() || extraMeta.siteId,
        feedExecutionLogId: n.metadata?.feedExecutionLogId?.toString(),
        originUrl: n.metadata?.originUrl,
      };

      const payload: NotificationMessageDTO = {
        id: n._id.toString(),
        target,
        type,
        title: n.title,
        message: safeMessage,
        createdAt: Date.now(),
        meta: integratedMeta,
      };

      console.log(
        `📡 [크론] 웹 서버로 [${channelName}] 대행 전송 시도... (${n.title})`,
      );

      // 3) 단건 전송 실행
      await triggerSseNotification(url, payload, channelName);
    } catch (loopError) {
      console.error(
        `❌ [${channelName}] 내부 알림 가공/전송 실패 (건너뜀):`,
        loopError,
      );
    }
  }
}
