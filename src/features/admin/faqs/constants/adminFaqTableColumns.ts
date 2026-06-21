import { FaqWithUserDto } from "@/features/support/faqs/dtos";
import { Column } from "../../types/admin-table";
import {
  AdminFaqSort,
  FAQ_CATEGORY_LABELS,
  FaqCategory,
} from "../types/search";

const FAQ_STATUS_LABEL = {
  PUBLISHED: "공개",
  HIDDEN: "비공개",
} as const;

export const adminFaqTableColumns: Column<FaqWithUserDto, AdminFaqSort>[] = [
  {
    key: "sortOrder",
    header: "순서",
    align: "center",
    render: (faq: FaqWithUserDto) => faq.sortOrder,
    sortable: true,
  },
  {
    key: "category",
    header: "카테고리",
    align: "center",
    render: (faq: FaqWithUserDto) =>
      FAQ_CATEGORY_LABELS[faq.category as FaqCategory],
    sortable: true,
  },
  {
    key: "question",
    header: "질문",
    render: (faq: FaqWithUserDto) => faq.question,
    sortable: true,
  },
  {
    key: "isPublished",
    header: "상태",
    align: "center",
    render: (faq: FaqWithUserDto) =>
      faq.isPublished ? FAQ_STATUS_LABEL.PUBLISHED : FAQ_STATUS_LABEL.HIDDEN,
    sortable: true,
  },
  {
    key: "createdAt",
    header: "생성일",
    align: "center",
    render: (faq: FaqWithUserDto) =>
      new Date(faq.createdAt).toLocaleDateString("ko-KR"),
    sortable: true,
  },
] as const;
