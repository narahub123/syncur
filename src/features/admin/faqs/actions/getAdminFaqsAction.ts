"use server";

import { requireAdmin } from "@/features/admin/lib/requireAdmin";
import { connectMongo } from "@/shared/lib/db/mongoose";
import { AdminFaqsQuery } from "../types/search";
import { adminFaqService } from "../services/AdminFaqService.instance";

export async function getAdminFaqsAction(query: AdminFaqsQuery) {
  await connectMongo();

  await requireAdmin();

  // 이제 전체 조회가 아닌, 쿼리 기반의 페이지네이션 조회를 수행합니다.
  return await adminFaqService.findAllPaginated(query);
}
