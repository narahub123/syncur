// 1. 문의하기 폼의 엄격한 타입 정의
export interface InquiryFormValues {
  title: string;
  email: string;
  content: string;
}

// 2. DynamicForm이 읽어서 화면을 그릴 설정 배열
export const inquiryFormConfig = [
  {
    name: "title",
    label: "문의 제목",
    type: "text" as const,
    placeholder: "무엇을 도와드릴까요?",
    required: true,
  },
  {
    name: "email",
    label: "답변받을 이메일",
    type: "text" as const,
    placeholder: "example@domain.com",
    required: true,
  },
  {
    name: "content",
    label: "문의 내용",
    type: "textarea" as const,
    placeholder: "상세한 문의 내용을 입력해 주세요.",
    required: true,
  },
];
