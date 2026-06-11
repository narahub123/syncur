"use server";

import { feedService } from "@/features/feeds/service/FeedService.instance";
import { connectMongo } from "@/shared/lib/db/mongoose";
import { FeedStatus } from "@/shared/types/feed";
import { requireAdmin } from "../../lib/requireAdmin";

export async function updateFeedStatusAction(params: {
  feedId: string;
  status: FeedStatus;
}) {
  /**
   * MongoDB 연결 보장
   */
  await connectMongo();

  /**
   * 관리자 권한 체크
   */
  await requireAdmin();

  return feedService.changeStatus(params.feedId, params.status);
}
