import { CLOUDINARY_FOLDERS } from "@/shared/lib/cloudinary/cloudinary.constant";
import {
  NOTICE_CATEGORY_OPTIONS,
  NOTICE_PIN_STATUS_OPTIONS,
} from "../types/search";
import { FormFieldConfig } from "@/shared/types/form";

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
    options: NOTICE_CATEGORY_OPTIONS,
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
    options: NOTICE_PIN_STATUS_OPTIONS,
    required: true,
  },
];
