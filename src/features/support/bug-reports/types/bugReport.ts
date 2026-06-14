// shared/types/bugReport.ts
import { FormFieldConfig } from "@/shared/types/form";

// 1. 버그 신고 폼의 엄격한 타입 정의
export interface BugReportFormValues {
  title: string;
  environment: string;
  content: string;
  file?: File; // 파일은 선택 사항
}

// 2. DynamicForm에 주입할 버그 신고용 설정 배열
export const bugReportFormConfig: FormFieldConfig[] = [
  {
    name: "title",
    label: "버그 제목",
    type: "text",
    placeholder: "어떤 문제가 발생했나요?",
    required: true,
  },
  {
    name: "environment",
    label: "발생 환경",
    type: "select",
    placeholder: "문제가 발생한 환경을 선택해 주세요",
    options: ["Web (Chrome/Safari)", "iOS App", "Android App", "기타"],
    required: true,
  },
  {
    name: "content",
    label: "상세 내용 및 재현 경로",
    type: "textarea",
    placeholder:
      "1. 어떤 페이지에서\n2. 어떤 버튼을 눌렀을 때\n3. 어떤 에러가 나는지 적어주세요.",
    required: true,
  },
  {
    name: "file",
    label: "증상 스크린샷 / 첨부파일",
    type: "file",
    required: false,
  },
];
