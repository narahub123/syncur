"use server";

import { connectMongo } from "@/shared/lib/db/mongoose";
import { requireAdmin } from "@/features/admin/lib/requireAdmin";
import { notificationService } from "@/features/notifications/service/NotificationService.instance";
import { AdminNotificationsQuery } from "../types";

/**
 * Admin - Notification 목록 조회 Action
 *
 * 역할:
 * - 관리자 전용 알림 조회
 * - pagination + search + sort 지원
 */
export async function getAdminNotificationsPaginatedAction(
  query: AdminNotificationsQuery,
) {
  await connectMongo();

  await requireAdmin();

  return await notificationService.findAllPaginated(query);
}
