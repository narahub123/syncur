import { getAdminFeedExecutionLogsPaginatedAction } from "../actions/getAdminFeedExecutionLogsPaginatedAction";
import { AdminFeedExecutionLogsQuery } from "../types";

/**
 * Feed Execution Log Fetcher
 *
 * - server action wrapper
 * - react-query 분리 목적
 */
export const fetchAdminFeedExecutionLogs = async (
  query: AdminFeedExecutionLogsQuery,
) => {
  return await getAdminFeedExecutionLogsPaginatedAction(query);
};
