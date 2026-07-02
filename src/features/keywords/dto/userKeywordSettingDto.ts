import { FeedFilter } from "../constants/feed-filter";
import { NotifyFilter } from "../constants/notify-filter";

export interface UserKeywordSettingDto {
  _id: string;
  userId: string;
  defaultFeedFilter: FeedFilter; // 필요 시 정확한 타입 지정
  defaultNotifyFilter: NotifyFilter;
  createdAt: Date;
  updatedAt: Date;
}
