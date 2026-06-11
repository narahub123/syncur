import { updateFeedErrorCountAction } from "../actions/updateFeedErrorCountAction";

export const updateFeedErrorCount = async (params: {
  feedId: string;
  errorCount: number;
}) => await updateFeedErrorCountAction(params);
