"use server";

import { connectMongo } from "@/shared/lib/db/mongoose";
import { requireAdmin } from "@/features/admin/lib/requireAdmin";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/shared/constants/routes";
import { adminNoticeService } from "@/features/admin/notices/services/AdminNoticeService.instance";

export async function deleteNoticeAction(id: string) {
  await connectMongo();

  await requireAdmin();

  try {
    await adminNoticeService.deleteNotice(id);

    // 삭제 후 목록 페이지의 캐시를 갱신합니다.
    revalidatePath(ROUTES.ADMIN_NOTICES);
  } catch (error) {
    console.error("공지 삭제 실패", error);
    return { success: false, error: "삭제 실패" };
  }
}
