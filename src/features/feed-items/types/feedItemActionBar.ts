import { FeedAction } from "@/features/feed-interaction/types/feedActionDispatcher";
import { LucideIcon } from "lucide-react";

export type FeedActionUI = {
  icon: LucideIcon;
  title: string;

  action: FeedAction;

  isToggle?: boolean;
};

/**
 * 신규 생성된 FeedItem 정보
 *
 * @description
 * bulkWrite upsert 결과 중 실제 INSERT 된 항목만 추출한다.
 */
export type CreatedFeedItem = {
  feedItemId: string;

  title: string;
  link: string;

  guid?: string;
};
