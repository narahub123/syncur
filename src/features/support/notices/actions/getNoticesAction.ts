"use server";

import { connectMongo } from "@/shared/lib/db/mongoose";
import { UserNoticesQuery } from "../types/search";
import { requireAuth } from "@/shared/lib/auth/requireAuth";
import { noticeService } from "../services/NoticeService.instance";

export async function getNoticesAction(query: UserNoticesQuery) {
  await connectMongo();

  await requireAuth();

  return await noticeService.getNoticesForUser(query);
}
