"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { InquiryQuery } from "../types/search";
import { fetchInquiries } from "../api/fetchInquiries";

type InquiryPaginationParams = InquiryQuery;

/**
 * 관리자 Inquiry Pagination Query Hook
 * - page 기반 목록 조회
 * - 테이블 UI 전용
 */
export function useAdminInquiriesQuery(params: InquiryPaginationParams) {
  return useQuery({
    queryKey: ["inquiries", params],

    queryFn: () => fetchInquiries(params),

    placeholderData: keepPreviousData,
  });
}
