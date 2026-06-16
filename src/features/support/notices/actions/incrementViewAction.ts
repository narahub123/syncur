"use server";

import { connectMongo } from "@/shared/lib/db/mongoose";
import { noticeService } from "@/features/support/notices/services/NoticeService.instance";

export async function incrementViewAction(id: string) {
  try {
    await connectMongo();

    // 서비스 계층의 조회수 증가 전용 메서드 호출
    await noticeService.incrementNoticeViews(id);

    return { success: true };
  } catch (error) {
    console.error("조회수 증가 실패:", error);
    // 조회수 증가는 실패해도 페이지 조회가 차단되면 안 되므로
    // 실패 시에도 에러를 던지지 않고 조용히 처리하는 것이 일반적입니다.
    return { success: false };
  }
}
