import { AdminFaqsQuery } from "../types/search";
import { createInfiniteQuery } from "../../hooks/createInfiniteQuery";
import { FaqStatsDto } from "../types/stats";
import { FaqWithUserDto } from "@/features/support/faqs/dtos";
import { getAdminFaqs } from "../api/getAdminFaqs";

export const useAdminFaqsInfiniteQuery = createInfiniteQuery<
  AdminFaqsQuery,
  FaqWithUserDto,
  FaqStatsDto
>("admin-faq-infinite", getAdminFaqs);
