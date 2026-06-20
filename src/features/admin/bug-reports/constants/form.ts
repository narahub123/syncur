import { FormFieldConfig } from "@/shared/types/form";
import { BUG_REPORT_STATUS_OPTIONS } from "../types/search";
import { CLOUDINARY_FOLDERS } from "@/shared/lib/cloudinary/cloudinary.constant";

export const bugAnswerFormConfig: FormFieldConfig[] = [
  {
    name: "status",
    label: "진행 상태 변경",
    type: "select",
    placeholder: "버그 처리 상태를 선택하세요.",
    options: BUG_REPORT_STATUS_OPTIONS, // 고정된 배열 대신 타입 안전한 옵션 사용
    required: true,
  },

  {
    name: "replyContent",
    label: "버그 분석 및 답변 작성",
    type: "textarea",
    placeholder:
      "원인 분석 결과 또는 유저에게 안내할 조치 사항을 입력해 주세요.",
    required: true,
  },
  {
    name: "images",
    label: "이미지 첨부",
    type: "file",
    isMultiple: true,
    accept: "image/*",
    required: false,
    folderName: CLOUDINARY_FOLDERS.BUG_REPORT_REPLIES,
  },
];
