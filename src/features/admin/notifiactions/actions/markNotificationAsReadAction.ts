"use server";

import { connectMongo } from "@/shared/lib/db/mongoose";
import { notificationService } from "@/features/notifications/service/NotificationService.instance";
import { requireAuth } from "@/shared/lib/auth/requireAuth";

export async function markNotificationAsReadAction(notificationId: string) {
  await connectMongo();

  const session = await requireAuth();

  return await notificationService.markAsRead(notificationId, session.user.id);
}
