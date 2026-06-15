import { FaqWithUserDto } from "@/features/support/faqs/dtos"; // 실제 DTO 경로에 맞게 수정하세요
import { AdminFaqSort } from "@/features/support/faqs/types/search";

/**
 * Admin FAQ Table Column
 */
export type AdminFaqTableColumn = {
  key: AdminFaqSort;
  header: string;
  align?: "left" | "center" | "right";
  render: (faq: FaqWithUserDto) => React.ReactNode;
};

export const adminFaqTableColumns: AdminFaqTableColumn[] = [
  /**
   * Sort Order
   */
  {
    key: "sortOrder",
    header: "순서",
    align: "center",
    render: (f) => f.sortOrder,
  },

  /**
   * Category
   */
  {
    key: "category",
    header: "카테고리",
    align: "center",
    render: (f) => f.category,
  },

  /**
   * Question
   */
  {
    key: "question",
    header: "질문",
    render: (f) => f.question,
  },

  /**
   * Published Status
   */
  {
    key: "isPublished",
    header: "상태",
    align: "center",
    render: (f) => (f.isPublished ? "공개" : "비공개"),
  },

  /**
   * Created At
   */
  {
    key: "createdAt",
    header: "생성일",
    align: "center",
    render: (f) => new Date(f.createdAt).toLocaleString("ko-KR"),
  },
];
