import { FormFieldConfig } from "../types/form";

export const bugReportConfig: FormFieldConfig[] = [
  {
    name: "title",
    label: "버그 제목",
    type: "text",
    placeholder: "어떤 문제가 발생했나요?",
    required: true,
  },
  {
    name: "category",
    label: "발생 환경",
    type: "select",
    options: ["Web", "iOS", "Android"],
    required: true,
  },
  {
    name: "content",
    label: "상세 내용",
    type: "textarea",
    placeholder: "버그 재현 경로를 적어주세요.",
    required: true,
  },
  { name: "attachment", label: "스크린샷 첨부", type: "file" },
];

export const qnaConfig: FormFieldConfig[] = [
  { name: "title", label: "문의 제목", type: "text", required: true },
  { name: "email", label: "답변받을 이메일", type: "text", required: true },
  { name: "content", label: "문의 내용", type: "textarea", required: true },
];
