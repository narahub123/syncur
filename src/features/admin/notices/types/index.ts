import { CLOUDINARY_FOLDERS } from "@/shared/lib/cloudinary/cloudinary.constant";
import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";
import { FormFieldConfig } from "@/shared/types/form";

export type NoticeCategory = "GENERAL" | "SERVICE" | "EVENT" | "MAINTENANCE";

// 1. 타입과 한글 라벨을 매핑
export const NoticeCategoryLabels: Record<NoticeCategory, string> = {
  GENERAL: "일반 공지",
  SERVICE: "서비스 안내",
  EVENT: "이벤트",
  MAINTENANCE: "점검 안내",
};

// 2. value(타입 값)와 label(한글)을 가진 배열 생성
export const NoticeCategoryOptions = (
  Object.keys(NoticeCategoryLabels) as NoticeCategory[]
).map((key) => ({
  value: key,
  label: NoticeCategoryLabels[key],
}));

export const NoticeStatusOptions = [
  { value: "fixed", label: "상단 고정" },
  { value: "normal", label: "일반 공지" },
];

export type NoticePinStatus = "fixed" | "normal";

// ==========================================
// 1. 공지사항(Notice) 타입 및 설정
// ==========================================
export interface NoticeFormValues {
  title: string;
  category: NoticeCategory;
  content: string;
  isPinned: NoticePinStatus;
  images: ImageInfo[];
}

export const noticeFormConfig: FormFieldConfig[] = [
  {
    name: "title",
    label: "공지 제목",
    type: "text",
    placeholder: "공지사항 제목을 입력해 주세요.",
    required: true,
  },
  {
    name: "category",
    label: "공지 분류",
    type: "select",
    placeholder: "분류를 선택해 주세요.",
    options: NoticeCategoryOptions,
    required: true,
  },
  {
    name: "content",
    label: "공지 내용",
    type: "editor",
    placeholder: "공지할 상세 내용을 입력해 주세요.",
    required: true,
    folderName: CLOUDINARY_FOLDERS.NOTICES,
  },
  {
    name: "images", // 폼 상태에 포함시키기 위해 추가
    label: "이미지 목록",
    type: "hidden", // DynamicForm에서 별도로 렌더링하지 않도록 타입 지정
  },
  {
    name: "isPinned",
    label: "상단 고정 여부",
    type: "select",
    placeholder: "고정 여부를 선택해 주세요.",
    options: NoticeStatusOptions,
    required: true,
  },
];
