import { InquiryQuery } from "../types/search";

export const inquiryKeys = {
  all: ["inquiries"] as const,

  list: (query: InquiryQuery) => [...inquiryKeys.all, "list", query] as const,

  detail: (id: string) => [...inquiryKeys.all, "detail", id] as const,
};
