import { NoticeResponseDTO } from "../dtos/noticeDto";
import {
  NOTICE_CATEGORY_LABELS,
  NoticeCategory,
} from "@/features/admin/notices/types/search";
import { UserNoticeSort } from "../types/search";
import { Column, COLUMN_ALIGN } from "@/features/admin/types/admin-table";

export const userNoticeTableColumns: Column<
  NoticeResponseDTO,
  UserNoticeSort
>[] = [
  {
    key: "title",
    header: "제목",
    render: (notice: NoticeResponseDTO) => (
      <p className="truncate">{`${notice.isPinned && "📌 "}${notice.title}`}</p>
    ),
    sortable: true,
  },
  {
    key: "category",
    header: "카테고리",
    render: (notice: NoticeResponseDTO) =>
      NOTICE_CATEGORY_LABELS[notice.category as NoticeCategory],
    sortable: true,
    align: COLUMN_ALIGN.CENTER,
  },
  {
    key: "views",
    header: "조회수",
    render: (notice: NoticeResponseDTO) => notice.views,
    sortable: true,
    align: COLUMN_ALIGN.CENTER,
  },
  {
    key: "createdAt",
    header: "생성일",
    render: (notice: NoticeResponseDTO) =>
      new Date(notice.createdAt).toLocaleDateString("ko-KR"),
    sortable: true,
    align: COLUMN_ALIGN.CENTER,
  },
] as const;
