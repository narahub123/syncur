"use server";

import { connectMongo } from "@/shared/lib/db/mongoose";
import { UpdateNoticeDto } from "../dtos";
import { noticeService } from "../services/NoticeService.instance";
import { requireAdmin } from "@/features/admin/lib/requireAdmin";

export async function updateNoticeAction(id: string, dto: UpdateNoticeDto) {
  await connectMongo();

  await requireAdmin();

  try {
    return await noticeService.updateNotice(id, dto);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "수정 실패",
    };
  }
}
