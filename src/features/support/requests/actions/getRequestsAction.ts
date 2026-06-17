"use server";

import { requireAdmin } from "@/features/admin/lib/requireAdmin";
import { connectMongo } from "@/shared/lib/db/mongoose";
import { requestService } from "../services/RequestService.instance";
import { AdminRequestQuery } from "../types/admin-search";

export async function getRequestsAction(query: AdminRequestQuery) {
  await connectMongo();
  await requireAdmin(); // 관리자 권한 확인

  return await requestService.getRequestsForAdmin(query);
}
