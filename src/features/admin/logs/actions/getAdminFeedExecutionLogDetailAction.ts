"use server";

import { connectMongo } from "@/shared/lib/db/mongoose";
import { requireAdmin } from "@/features/admin/lib/requireAdmin";
import { feedExecutionLogService } from "@/features/feed-execution-logs/service/FeedExecutionLogService.instance";

/**
 * Admin - FeedExecutionLog 상세 조회 Action
 *
 * 역할:
 * - 관리자 전용 장애 수집 로그 단건 상세 조회
 * - DB 연결 및 어드민 권한 검증 수행 후 서비스 레이어 호출
 */
export async function getAdminFeedExecutionLogDetailAction(id: string) {
  await connectMongo();
  await requireAdmin();

  return await feedExecutionLogService.getLogDetailById(id);
}
