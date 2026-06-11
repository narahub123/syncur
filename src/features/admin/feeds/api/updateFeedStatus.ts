import { FeedStatus } from "@/shared/types/feed";
import { updateFeedStatusAction } from "../actions/updateFeedStatusAction";

export const updateFeedStatus = (params: {
  feedId: string;
  status: FeedStatus;
}) => updateFeedStatusAction(params);
