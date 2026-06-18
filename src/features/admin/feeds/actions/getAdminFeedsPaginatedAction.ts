"use server";

import { connectMongo } from "@/shared/lib/db/mongoose";
import { requireAdmin } from "@/features/admin/lib/requireAdmin";
import { AdminFeedsQuery } from "../types/search";
import { adminFeedService } from "../services/AdminFeedService.instance";

/**
 * Admin - Feed 목록 조회 Action
 *
 * 역할:
 * - 관리자 전용 Feed 조회
 * - pagination + search 지원
 */
export async function getAdminFeedsPaginatedAction(query: AdminFeedsQuery) {
  /**
   * MongoDB 연결 보장
   */
  await connectMongo();

  /**
   * 관리자 권한 체크
   */
  await requireAdmin();

  /**
   * Feed 목록 조회
   */
  return await adminFeedService.getFeedsPaginated(query);
}
