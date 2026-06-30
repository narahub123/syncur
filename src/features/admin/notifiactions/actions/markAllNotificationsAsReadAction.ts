"use server";

import { NotificationTarget } from "@/features/notifications/constants/notification-target";
import { NotificationType } from "@/features/notifications/constants/notification-type";
import { notificationService } from "@/features/notifications/service/NotificationService.instance";
import { requireAuth } from "@/shared/lib/auth/requireAuth";
import { connectMongo } from "@/shared/lib/db/mongoose";

export async function markAllNotificationsAsReadAction(
  target: NotificationTarget,
  types?: NotificationType[], 
) {
  await connectMongo();

  const session = await requireAuth();

  return await notificationService.markAllAsRead(
    session.user.id,
    target,
    types,
  );
}
