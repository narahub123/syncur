"use client";

import { useQuery } from "@tanstack/react-query";
import { getInquiryAction } from "../actions/getInquiryAction";
import { inquiryKeys } from "../constants/inquiryKeys";

export function useInquiryQuery(inquiryId: string) {
  return useQuery({
    queryKey: inquiryKeys.detail(inquiryId),

    queryFn: () => getInquiryAction(inquiryId),

    enabled: !!inquiryId,
  });
}
