"use server";

import { connectMongo } from "@/shared/lib/db/mongoose";
import { noticeService } from "../services/NoticeService.instance";

/**
 * 유저용 공지사항 상세 조회 액션
 */
export async function getNoticeDetailAction(id: string) {
  await connectMongo();

  try {
    const notice = await noticeService.getNoticeDetail(id);
    // 직렬화하여 클라이언트로 전달
    return JSON.parse(JSON.stringify(notice));
  } catch (error) {
    console.error("Failed to fetch notice detail:", error);
    return null;
  }
}
