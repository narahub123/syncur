"use server";

import { notificationService } from "@/features/notifications/service/NotificationService.instance";
import { requireAuth } from "@/shared/lib/auth/requireAuth";
import { connectMongo } from "@/shared/lib/db/mongoose";

export async function markAllNotificationsAsReadAction() {
  await connectMongo();

  const session = await requireAuth();

  return await notificationService.markAllAsRead(session.user.id);
}
