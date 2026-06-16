// shared/types/bugReport.ts
import { FormFieldConfig } from "@/shared/types/form";

export type OSType = "Web" | "iOS" | "Android";

export const BUG_REPORT_OS_OPTION: { label: string; value: OSType }[] = [
  { label: "Web", value: "Web" },
  { label: "iOS", value: "iOS" },
  { label: "Android", value: "Android" },
];

// 1. 스키마의 RequestMetadata 구조와 일치하도록 확장
export interface BugReportFormValues {
  title: string;
  content: string;
  // 스키마의 metadata 객체 구조를 폼에서 평탄화(flatten)하거나 객체로 유지
  os: OSType;
  browser: string; // 스키마에 정의된 browser 필드 추가
  fileUrls: File[]; // 스키마의 fileUrls(string[])를 고려하여 폼에서는 File 객체로 관리
}

// 2. DynamicForm 설정
export const bugReportFormConfig: FormFieldConfig[] = [
  {
    name: "title",
    label: "버그 제목",
    type: "text",
    required: true,
  },
  {
    name: "os", // 스키마의 os 필드명과 일치
    label: "발생 환경",
    type: "select",
    options: BUG_REPORT_OS_OPTION,
    required: true,
  },
  {
    name: "browser", // 스키마의 browser 필드명과 일치
    label: "사용 브라우저",
    type: "text",
    required: true,
  },
  {
    name: "content",
    label: "상세 내용",
    type: "textarea",
    required: true,
  },
  {
    name: "fileUrls",
    label: "스크린샷",
    type: "file",
    required: false,
  },
];
