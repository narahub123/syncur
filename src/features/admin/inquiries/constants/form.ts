import { FormFieldConfig } from "@/shared/types/form";
import { ANSWER_STATUS_OPTIONS } from "../types/search";
import { CLOUDINARY_FOLDERS } from "@/shared/lib/cloudinary/cloudinary.constant";

export const answerFormConfig: FormFieldConfig[] = [
  {
    name: "status",
    label: "문의 상태 변경",
    type: "select",
    options: ANSWER_STATUS_OPTIONS,
    required: true,
  },
  {
    name: "replyContent",
    label: "답변 작성",
    type: "textarea",
    placeholder: "유저에게 전달할 답변 내용을 입력해 주세요.",
    required: true,
  },

  {
    name: "images",
    label: "이미지 첨부",
    type: "file",
    isMultiple: true,
    accept: "image/*",
    required: false,
    folderName: CLOUDINARY_FOLDERS.INQUIRY_REPLIES,
  },
];
