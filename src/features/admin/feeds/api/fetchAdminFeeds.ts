import { getAdminFeedsPaginatedAction } from "../actions/getAdminFeedsPaginatedAction";

/**
 * Feed 목록 Fetcher
 *
 * - server action 호출 래퍼
 * - react-query와 action 분리 목적
 */
export const fetchAdminFeeds = async (params: {
  search?: string;
  limit?: number;
  page?: number;
}) => {
  return await getAdminFeedsPaginatedAction(params);
};
