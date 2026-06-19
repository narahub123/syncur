"use server";

import { requireAdmin } from "@/features/admin/lib/requireAdmin";
import { AdminNoticeQuery } from "@/features/admin/notices/types/search";
import { adminNoticeService } from "../services/AdminNoticeService.instance";
import { connectMongo } from "@/shared/lib/db/mongoose";

export async function getAdminNoticesAction(query: AdminNoticeQuery) {
  await connectMongo();

  await requireAdmin();

  return await adminNoticeService.getNoticesForAdmin(query);
}
