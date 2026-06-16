"use server";

import { requireAdmin } from "@/features/admin/lib/requireAdmin";
import { noticeService } from "@/features/support/notices/services/NoticeService.instance";
import { AdminNoticeQuery } from "@/features/support/notices/types/admin-search";
import { connectMongo } from "@/shared/lib/db/mongoose";

export async function getAdminNoticesAction(query: AdminNoticeQuery) {
  await connectMongo();

  await requireAdmin();

  return await noticeService.getNoticesForAdmin(query);
}
