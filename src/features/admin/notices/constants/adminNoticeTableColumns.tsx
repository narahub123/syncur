import {
  AdminNoticeResponseDTO,
  AdminNoticeSort,
} from "@/features/support/notices/types/admin-search";

import { NoticeCategory, NoticeCategoryLabels } from "../types";
import { Avatar } from "@/shared/components/common/Avartar";

export type AdminNoticeTableColumn = {
  key: AdminNoticeSort;
  header: string;
  align?: "left" | "center" | "right";
  render: (faq: AdminNoticeResponseDTO) => React.ReactNode;
};

export const adminNoticeTableColumns: AdminNoticeTableColumn[] = [
  {
    key: "isPinned",
    header: "고정",
    render: (n) => (n.isPinned ? "📌" : "-"),
  },
  {
    key: "title",
    header: "제목",
    render: (n) => n.title,
  },
  {
    key: "category",
    header: "카테고리",
    render: (n) => NoticeCategoryLabels[n.category as NoticeCategory],
  },
  {
    key: "views",
    header: "조회수",
    render: (n) => n.views,
  },
  {
    key: "createdBy",
    header: "작성자",
    render: (n) => (
      <div className="flex items-center gap-2">
        <Avatar
          src={n.author?.profileImage || n.author?.image}
          name={n.author?.name}
          className="h-6 w-6"
        />
        <span>{n.author?.name || "알 수 없음"}</span>
      </div>
    ),
  },
  {
    key: "createdAt",
    header: "생성일",
    render: (n) => new Date(n.createdAt).toLocaleDateString("ko-KR"),
  },
];
