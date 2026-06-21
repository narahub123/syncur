import { FormFieldConfig } from "@/shared/types/form";
import { FAQ_CATEGORY_OPTIONS, FaqPublishOptions } from "../types/search";

//  DynamicForm에 주입할 FAQ 작성용 설정
export const faqFormConfig: FormFieldConfig[] = [
  {
    name: "category",
    label: "FAQ 카테고리",
    type: "select",
    placeholder: "카테고리를 선택해 주세요.",
    options: FAQ_CATEGORY_OPTIONS,
    required: true,
  },
  {
    name: "question",
    label: "자주 묻는 질문 (Question)",
    type: "text",
    placeholder:
      "유저들이 자주 묻는 질문 내용을 요약해서 입력해 주세요. (예: 비밀번호를 재설정하고 싶어요.)",
    required: true,
  },
  {
    name: "answer",
    label: "답변 내용 (Answer)",
    type: "textarea",
    placeholder: "질문에 대한 명확하고 친절한 해결 방법을 입력해 주세요.",
    required: true,
  },
  {
    name: "sortOrder",
    label: "노출 순서 가중치",
    type: "text",
    placeholder: "숫자가 낮을수록 목록 상단에 노출됩니다. (기본값: 10)",
    required: true,
  },
  {
    name: "isPublished",
    label: "공개 여부",
    type: "select",
    placeholder: "공개 상태를 설정해 주세요.",
    options: FaqPublishOptions,
    required: true,
  },
];
