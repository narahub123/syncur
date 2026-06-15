import { FormFieldConfig } from "@/shared/types/form";

// ==========================================
// 1. 공지사항(Notice) 타입 및 설정
// ==========================================
export interface NoticeFormValues {
  title: string;
  category: "일반" | "점검" | "이벤트" | "업데이트";
  content: string;
  isPinned: "일반 공지" | "상단 고정";
}

export const noticeFormConfig: FormFieldConfig[] = [
  {
    name: "title",
    label: "공지 제목",
    type: "text",
    placeholder: "공지사항 제목을 입력해 주세요.",
    required: true,
  },
  {
    name: "category",
    label: "공지 분류",
    type: "select",
    placeholder: "분류를 선택해 주세요.",
    options: ["일반", "점검", "이벤트", "업데이트"],
    required: true,
  },
  {
    name: "content",
    label: "공지 내용",
    type: "editor",
    placeholder: "공지할 상세 내용을 입력해 주세요.",
    required: true,
  },
  {
    name: "isPinned",
    label: "상단 고정 여부",
    type: "select",
    placeholder: "고정 여부를 선택해 주세요.",
    options: ["일반 공지", "상단 고정"],
    required: true,
  },
];
