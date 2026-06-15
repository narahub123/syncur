import { FormFieldConfig } from "@/shared/types/form";

// 1. FAQ 등록/수정 시 사용할 Form Values 타입
export interface FaqFormValues {
  id: string;
  category: "계정/인증" | "결제/환불" | "서비스이용" | "기타";
  question: string;
  answerContent: string;
  sortOrder: string; // 폼 입력값은 기본적으로 문자열로 들어오므로 string 처리 (제출 시 숫자로 변환)
  isPublished: "공개" | "비공개";
}

// 2. DynamicForm에 주입할 FAQ 작성용 설정
export const faqFormConfig: FormFieldConfig[] = [
  {
    name: "category",
    label: "FAQ 카테고리",
    type: "select",
    placeholder: "카테고리를 선택해 주세요.",
    options: ["계정/인증", "결제/환불", "서비스이용", "기타"],
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
    name: "answerContent",
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
    options: ["공개", "비공개"],
    required: true,
  },
];
