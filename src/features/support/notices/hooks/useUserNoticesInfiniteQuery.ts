import { createInfiniteQuery } from "@/features/admin/hooks/createInfiniteQuery";
import { UserNoticesQuery } from "../types/search";
import { NoticeResponseDTO } from "../dtos/noticeDto";
import { getNotices } from "../api/getNotices";

export const useUserNoticesInfiniteQuery = createInfiniteQuery<
  UserNoticesQuery,
  NoticeResponseDTO,
  unknown
>("admin-notices-infinite", getNotices);
