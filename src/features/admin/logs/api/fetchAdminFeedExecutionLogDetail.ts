import { getAdminFeedExecutionLogDetailAction } from "../actions/getAdminFeedExecutionLogDetailAction";

/**
 * Admin FeedExecutionLog Detail Fetcher
 * - 클라이언트 사이드에서 Server Action을 일반 API처럼 명시적으로 호출하기 위한 브릿지 함수
 */
export const fetchAdminFeedExecutionLogDetail = async (id: string) => {
  return await getAdminFeedExecutionLogDetailAction(id);
};
