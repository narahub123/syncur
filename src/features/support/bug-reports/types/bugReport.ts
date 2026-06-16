// shared/types/bugReport.ts
import { CLOUDINARY_FOLDERS } from "@/shared/lib/cloudinary/cloudinary.constant";
import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";
import { FormFieldConfig } from "@/shared/types/form";

export const BUG_CATEGORIES = {
  UI: "UI/디자인 오류",
  FUNCTION: "기능 동작 오류",
  PERFORMANCE: "속도/성능 문제",
  CRITICAL: "심각한 오류",
} as const;

export type BugCategoryType = keyof typeof BUG_CATEGORIES;

export type OSType = "Web" | "iOS" | "Android";

export const BUG_REPORT_OS_OPTION: { label: string; value: OSType }[] = [
  { label: "Web", value: "Web" },
  { label: "iOS", value: "iOS" },
  { label: "Android", value: "Android" },
];

export const BUG_CATEGORY_OPTIONS = [
  { value: "FUNCTION", label: "기능 동작 오류" },
  { value: "UI", label: "UI/디자인 문제" },
  { value: "PERFORMANCE", label: "속도/성능 문제" },
  { value: "CRITICAL", label: "긴급 장애" },
];
// 1. 스키마의 RequestMetadata 구조와 일치하도록 확장
export interface BugReportFormValues {
  category: string;
  title: string;
  content: string;

  // 스키마의 metadata 객체 구조를 폼에서 평탄화(flatten)하거나 객체로 유지
  os: OSType;
  browser: string; // 스키마에 정의된 browser 필드 추가
  images: ImageInfo[]; // 스키마의 ImageInfo(string[])를 고려하여 폼에서는 File 객체로 관리
}

// 2. DynamicForm 설정
export const bugReportFormConfig: FormFieldConfig[] = [
  {
    name: "category", // 💡 추가
    label: "오류 유형",
    type: "select",
    options: BUG_CATEGORY_OPTIONS,
    required: true,
  },
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
    name: "images",
    label: "스크린샷",
    isMultiple: true,
    type: "file" as const,
    required: false,
    folderName: CLOUDINARY_FOLDERS.BUG_REPORTS,
  },
];
