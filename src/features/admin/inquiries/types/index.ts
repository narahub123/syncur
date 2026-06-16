// shared/types/inquiry.ts
import { FormFieldConfig } from "@/shared/types/form";

// 1. 상태 타입 정의
export type InquiryStatus = "대기중" | "처리중" | "답변완료";

// 2. 문의 상태 옵션 정의 (Select용)
export const INQUIRY_STATUS_OPTIONS: { label: string; value: InquiryStatus }[] =
  [
    { label: "대기중", value: "대기중" },
    { label: "처리중", value: "처리중" },
    { label: "답변완료", value: "답변완료" },
  ];

// 3. 답변 시 변경 가능한 상태 옵션 정의
export type AnswerStatus = "처리중" | "답변완료";

export const ANSWER_STATUS_OPTIONS: { label: string; value: AnswerStatus }[] = [
  { label: "처리중", value: "처리중" },
  { label: "답변완료", value: "답변완료" },
];

// 4. 문의 상세 데이터 타입
export interface UserInquiryData {
  id: string;
  userEmail: string;
  title: string;
  content: string;
  createdAt: string;
  currentStatus: InquiryStatus; // string 대신 타입 적용
}

// 5. 답변 폼 값 타입
export interface AnswerFormValues {
  replyContent: string;
  status: AnswerStatus; // string 대신 타입 적용
}

// 6. DynamicForm 설정
export const answerFormConfig: FormFieldConfig[] = [
  {
    name: "replyContent",
    label: "답변 작성",
    type: "textarea",
    placeholder: "유저에게 전달할 답변 내용을 입력해 주세요.",
    required: true,
  },
  {
    name: "status",
    label: "문의 상태 변경",
    type: "select",
    placeholder: "답변 제출 후 변경할 상태를 선택하세요.",
    options: ANSWER_STATUS_OPTIONS, // 고정 배열 대신 상수 사용
    required: true,
  },
];
