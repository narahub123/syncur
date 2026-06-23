import { createInfiniteQuery } from "@/features/admin/hooks/createInfiniteQuery";
import { InquiryQuery } from "../types/search";
import { AdminInquiryResponseDTO } from "../dto/inquiryDto";
import { fetchInquiries } from "../api/fetchInquiries";
import { InquiryStatsDTO } from "@/features/support/inquiries/dto/inquiryStatDTO";

export const useAdminInquiriesInfiniteQuery = createInfiniteQuery<
  InquiryQuery,
  AdminInquiryResponseDTO,
  InquiryStatsDTO
>("inquiries", fetchInquiries);
