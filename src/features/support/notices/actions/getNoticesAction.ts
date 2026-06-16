"use server";

import { connectMongo } from "@/shared/lib/db/mongoose";
import { UserNoticeQuery } from "../types/user-search";
import { requireAuth } from "@/shared/lib/auth/requireAuth";
import { noticeService } from "../services/NoticeService.instance";

export async function getNoticesAction(query: UserNoticeQuery) {
  await connectMongo();

  await requireAuth();

  return await noticeService.getNoticesForUser(query);
}
