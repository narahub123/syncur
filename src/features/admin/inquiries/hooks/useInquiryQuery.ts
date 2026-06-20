"use client";

import { useQuery } from "@tanstack/react-query";
import { getInquiryAction } from "../actions/getInquiryAction";

export function useInquiryQuery(inquiryId: string) {
  return useQuery({
    queryKey: ["inquiry", inquiryId],

    queryFn: () => getInquiryAction(inquiryId),

    enabled: !!inquiryId,
  });
}
