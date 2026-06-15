import { FormFieldConfig } from "@/shared/types/form";

// 1. 카테고리 정의 객체 (상수)
// Key는 식별자, Value는 화면 표시용 명칭입니다.
export const FAQ_CATEGORY_MAP = {
  FEED_MGMT: "피드 관리",
  NOTI_RECV: "알림/수신",
  ERROR_REPORT: "오류/신고",
  ACCOUNT_ETC: "계정/기타",
} as const;

// 2. 이 객체의 Value들만 추출하여 타입으로 생성
export type FaqCategory =
  (typeof FAQ_CATEGORY_MAP)[keyof typeof FAQ_CATEGORY_MAP];

// 3. (옵션) 폼 옵션 생성용 배열 자동 생성
// Object.entries를 활용해 코드 한 번으로 폼 옵션을 만듭니다.
export const FAQ_CATEGORY_OPTIONS = Object.entries(FAQ_CATEGORY_MAP).map(
  ([_, label]) => ({
    value: label, // DB에 저장할 값
    label: label, // 화면에 표시할 값
  }),
);

// 1. FAQ 등록/수정 시 사용할 Form Values 타입
export interface FaqFormValues {
  id: string;
  userId: string;
  category: FaqCategory;
  question: string;
  answer: string;
  sortOrder: string; // 폼 입력값은 기본적으로 문자열로 들어오므로 string 처리 (제출 시 숫자로 변환)
  isPublished: "공개" | "비공개";
  createdAt: string;
}

// 2. DynamicForm에 주입할 FAQ 작성용 설정
export const faqFormConfig: FormFieldConfig[] = [
  {
    name: "category",
    label: "FAQ 카테고리",
    type: "select",
    placeholder: "카테고리를 선택해 주세요.",
    options: Object.values(FAQ_CATEGORY_MAP),
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
    options: ["공개", "비공개"],
    required: true,
  },
];
