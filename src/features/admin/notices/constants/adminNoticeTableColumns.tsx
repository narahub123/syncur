import { Avatar } from "@/shared/components/common/Avartar";
import { AdminNoticeResponseDTO } from "@/features/support/notices/dtos/noticeDto";
import { Column, COLUMN_ALIGN } from "../../types/admin-table";
import {
  AdminNoticeSort,
  NOTICE_CATEGORY_LABELS,
  NoticeCategory,
} from "../types/search";

export const adminNoticeTableColumns: Column<
  AdminNoticeResponseDTO,
  AdminNoticeSort
>[] = [
  {
    key: "isPinned",
    header: "고정",
    render: (notice: AdminNoticeResponseDTO) => (notice.isPinned ? "📌" : "-"),
    sortable: true,
    align: COLUMN_ALIGN.CENTER,
  },
  {
    key: "title",
    header: "제목",
    render: (notice: AdminNoticeResponseDTO) => notice.title,
    sortable: true,
  },
  {
    key: "category",
    header: "카테고리",
    render: (notice: AdminNoticeResponseDTO) =>
      NOTICE_CATEGORY_LABELS[notice.category as NoticeCategory],
    sortable: true,
    align: COLUMN_ALIGN.CENTER,
  },
  {
    key: "views",
    header: "조회수",
    render: (notice: AdminNoticeResponseDTO) => notice.views,
    sortable: true,
    align: COLUMN_ALIGN.CENTER,
  },
  {
    key: "createdBy",
    header: "작성자",
    render: (notice: AdminNoticeResponseDTO) => (
      <div className="flex items-center gap-2">
        <Avatar
          src={notice.author?.profileImage || notice.author?.image}
          name={notice.author?.name}
          className="h-6 w-6"
        />
        <span>{notice.author?.name || "알 수 없음"}</span>
      </div>
    ),
    sortable: true,
  },
  {
    key: "createdAt",
    header: "생성일",
    render: (notice: AdminNoticeResponseDTO) =>
      new Date(notice.createdAt).toLocaleDateString("ko-KR"),
    sortable: true,
  },
] as const;
