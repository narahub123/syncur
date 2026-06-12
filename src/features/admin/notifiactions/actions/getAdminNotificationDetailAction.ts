"use server";

import { connectMongo } from "@/shared/lib/db/mongoose";
import { requireAdmin } from "@/features/admin/lib/requireAdmin";
import { notificationService } from "@/features/notifications/service/NotificationService.instance";

/**
 * Admin - Notification 상세 조회 Action
 *
 * 역할:
 * - 관리자 전용 알림 상세 조회
 * - 존재하지 않으면 404 처리 (service 내부 notFound)
 */
export async function getAdminNotificationDetailAction(id: string) {
  await connectMongo();

  await requireAdmin();

  return await notificationService.getNotificationDetail(id);
}
