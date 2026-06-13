"use server";

import { connectMongo } from "@/shared/lib/db/mongoose";
import { notificationService } from "@/features/notifications/service/NotificationService.instance";
import { requireAuth } from "@/shared/lib/auth/requireAuth";
import { NotificationTarget } from "../constants/notification-target";

/**
 * 현재 로그인 사용자의
 * 읽지 않은 알림 개수 조회
 */
export async function getUnreadNotificationCountAction(
  target: NotificationTarget,
) {
  await connectMongo();

  const session = await requireAuth();

  return await notificationService.countUnreadByUserId(session.user.id, target);
}
