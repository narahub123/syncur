"use server";

import { NotificationTarget } from "@/features/notifications/constants/notification-target";
import { notificationService } from "@/features/notifications/service/NotificationService.instance";
import { requireAuth } from "@/shared/lib/auth/requireAuth";
import { connectMongo } from "@/shared/lib/db/mongoose";

export async function markAllNotificationsAsReadAction(
  target: NotificationTarget,
) {
  await connectMongo();

  const session = await requireAuth();

  return await notificationService.markAllAsRead(session.user.id, target);
}
