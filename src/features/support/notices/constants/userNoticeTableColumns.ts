import {
  NoticeCategory,
  NoticeCategoryLabels,
} from "@/features/admin/notices/types";
import { UserNoticeSort } from "../types/user-search";
import { NoticeResponseDTO } from "../dtos";

export type UserNoticeTableColumn = {
  key: UserNoticeSort;
  header: string;
  align?: "left" | "center" | "right";
  render: (notice: NoticeResponseDTO) => React.ReactNode;
};

export const userNoticeTableColumns: UserNoticeTableColumn[] = [
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
    key: "createdAt",
    header: "생성일",
    render: (n) => new Date(n.createdAt).toLocaleDateString("ko-KR"),
  },
];
