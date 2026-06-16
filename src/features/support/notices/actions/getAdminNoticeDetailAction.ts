"use server";

import { connectMongo } from "@/shared/lib/db/mongoose";
import { noticeService } from "../services/NoticeService.instance";
import { requireAdmin } from "@/features/admin/lib/requireAdmin";

/**
 * 관리자용 공지사항 상세 조회 액션
 */
export async function getAdminNoticeDetailAction(id: string) {
  await connectMongo();

  await requireAdmin();

  try {
    const notice = await noticeService.getAdminNoticeDetail(id);
    // 직렬화하여 클라이언트로 전달
    return JSON.parse(JSON.stringify(notice));
  } catch (error) {
    console.error("Failed to fetch admin notice detail:", error);
    return null;
  }
}
