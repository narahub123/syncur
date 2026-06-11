"use server";

import { connectMongo } from "@/shared/lib/db/mongoose";
import { requireAdmin } from "@/features/admin/lib/requireAdmin";
import { feedService } from "@/features/feeds/service/FeedService.instance";
import { AdminFeedsQuery } from "../types";

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
  return await feedService.getFeedsPaginated(query);
}
