import { createInfiniteQuery } from "@/features/admin/hooks/createInfiniteQuery";
import { InquiryQuery } from "../types/search";
import { AdminInquiryResponseDTO } from "../dto/inquiryDto";
import { fetchInquiries } from "../api/fetchInquiries";

export const useAdminInquiriesInfiniteQuery = createInfiniteQuery<
  InquiryQuery,
  AdminInquiryResponseDTO,
  unknown
>("inquiries-infinite", fetchInquiries);
