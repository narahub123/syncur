"use server";

import { connectMongo } from "@/shared/lib/db/mongoose";
import { requireAdmin } from "../../lib/requireAdmin";
import { feedService } from "@/features/feeds/service/FeedService.instance";

export async function updateFeedErrorCountAction(params: {
  feedId: string;
  errorCount: number;
}) {
  /**
   * MongoDB 연결 보장
   */
  await connectMongo();

  /**
   * 관리자 권한 체크
   */
  await requireAdmin();

  return feedService.changeErrorCount(params.feedId, params.errorCount);
}
