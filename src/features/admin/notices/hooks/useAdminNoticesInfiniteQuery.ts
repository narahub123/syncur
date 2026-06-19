import { AdminNoticeResponseDTO } from "@/features/support/notices/dtos/noticeDto";
import { createInfiniteQuery } from "../../hooks/createInfiniteQuery";
import { AdminNoticeQuery } from "../types/search";
import { getAdminNotices } from "../api/getAdminNotices";
import { NoticeStatDto } from "../dto/noticeStatDto";

export const useAdminNoticesInfiniteQuery = createInfiniteQuery<
  AdminNoticeQuery,
  AdminNoticeResponseDTO,
  NoticeStatDto
>("admin-notices-infinite", getAdminNotices);
