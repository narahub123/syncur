import { getInquiriesAction } from "../actions/getInquiriesAction";
import { InquiryQuery } from "../types/search";

/**
 * Inquiry 관리자 목록 조회 Fetcher
 * - Server Action 호출 래퍼
 * - React Query / Infinite Query에서 사용
 */
export async function fetchInquiries(query: InquiryQuery) {
  return await getInquiriesAction(query);
}
