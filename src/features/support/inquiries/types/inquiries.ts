import { CLOUDINARY_FOLDERS } from "@/shared/lib/cloudinary/cloudinary.constant";
import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";

export const INQUIRY_CATEGORIES = {
  PAYMENT: "결제/환불",
  ACCOUNT: "계정/로그인",
  SERVICE: "서비스 이용 문의",
  OTHER: "기타",
} as const;

export type InquriyCategoryType = keyof typeof INQUIRY_CATEGORIES;

// 카테고리 상수
export const INQUIRY_CATEGORIES_OPTIONS = [
  { value: "PAYMENT", label: "결제/환불" },
  { value: "ACCOUNT", label: "계정/로그인" },
  { value: "SERVICE", label: "서비스 이용 문의" },
  { value: "OTHER", label: "기타" },
];

// 1. 문의하기 폼의 엄격한 타입 정의
export interface InquiryFormValues {
  category: string;
  title: string;
  email?: string;
  content: string;
  images: ImageInfo[]; // 💡 DynamicForm에서 관리할 이미지 상태 타입
}

// 2. DynamicForm이 읽어서 화면을 그릴 설정 배열
export const inquiryFormConfig = [
  {
    name: "category", // 💡 추가된 카테고리 필드
    label: "문의 유형",
    type: "select" as const,
    options: INQUIRY_CATEGORIES_OPTIONS,
    required: true,
  },
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
    required: false,
  },
  {
    name: "content",
    label: "문의 내용",
    type: "textarea" as const,
    placeholder: "상세한 문의 내용을 입력해 주세요.",
    required: true,
  },
  {
    name: "images",
    label: "이미지 첨부",
    type: "file" as const,
    isMultiple: true, // 여러 장 업로드 가능하도록 설정
    accept: "image/*", // 이미지만 선택 가능
    required: false,
    folderName: CLOUDINARY_FOLDERS.INQUIRIES,
  },
];
