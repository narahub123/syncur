import { getAdminFeedsPaginatedAction } from "../actions/getAdminFeedsPaginatedAction";
import { AdminFeedsQuery } from "../types";

/**
 * Feed 목록 Fetcher
 *
 * - server action 호출 래퍼
 * - react-query와 action 분리 목적
 */
export const fetchAdminFeeds = async (query: AdminFeedsQuery) => {
  return await getAdminFeedsPaginatedAction(query);
};
