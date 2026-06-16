import { FormFieldConfig } from "../types/form";

export const qnaConfig: FormFieldConfig[] = [
  { name: "title", label: "문의 제목", type: "text", required: true },
  { name: "email", label: "답변받을 이메일", type: "text", required: true },
  { name: "content", label: "문의 내용", type: "textarea", required: true },
];
