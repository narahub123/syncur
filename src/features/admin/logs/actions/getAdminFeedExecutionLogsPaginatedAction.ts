"use server";

import { connectMongo } from "@/shared/lib/db/mongoose";
import { requireAdmin } from "@/features/admin/lib/requireAdmin";
import { AdminFeedExecutionLogsQuery } from "../types/search";
import { adminFeedExecutionLogService } from "../services/AdminFeedExecutionLogService.instance";

/**
 * Admin - Feed Execution Log 목록 조회 Action
 *
 * 역할:
 * - 관리자 전용 로그 조회
 * - pagination + search + sort 지원
 */
export async function getAdminFeedExecutionLogsPaginatedAction(
  query: AdminFeedExecutionLogsQuery,
) {
  /**
   * MongoDB 연결 보장
   */
  await connectMongo();

  /**
   * 관리자 권한 체크
   */
  await requireAdmin();

  /**
   * 로그 조회
   */
  return await adminFeedExecutionLogService.getFeedExecutionLogsPaginated(
    query,
  );
}
