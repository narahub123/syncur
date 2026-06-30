"use server";

import { UserNotificationsQuery } from "../types/search";
import { notificationService } from "../service/NotificationService.instance";
import { requireAuth } from "@/shared/lib/auth/requireAuth";

/**
 * 사용자 알림 목록 조회
 */
export async function getMyNotificationsAction(query: UserNotificationsQuery) {
  const session = await requireAuth();

  if (!session?.user?.id) {
    throw new Error("로그인이 필요합니다.");
  }

  return notificationService.findUserNotificationsPaginated(
    session.user.id,
    query,
  );
}
