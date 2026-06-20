import { AdminNoticeResponseDTO } from "@/features/support/notices/dtos/noticeDto";
import { createInfiniteQuery } from "../../hooks/createInfiniteQuery";
import { AdminNoticeQuery } from "../types/search";
import { getAdminNotices } from "../api/getAdminNotices";
import { NoticeStatsDto } from "../dto/noticeStatsDto";

export const useAdminNoticesInfiniteQuery = createInfiniteQuery<
  AdminNoticeQuery,
  AdminNoticeResponseDTO,
  NoticeStatsDto
>("admin-notices-infinite", getAdminNotices);
