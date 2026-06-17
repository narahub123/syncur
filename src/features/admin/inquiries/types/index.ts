// shared/types/inquiry.ts
import { RequestMetadata } from "@/features/support/requests/types/lean";
import { UserBasicDto } from "@/features/users/dto/userDto";
import { CLOUDINARY_FOLDERS } from "@/shared/lib/cloudinary/cloudinary.constant";
import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";
import { FormFieldConfig } from "@/shared/types/form";

// 1. 상태 상수 정의
export const Inquiry_Status = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
} as const;

// 2. 타입 추출 ("PENDING" | "PROCESSING" | "COMPLETED")
export type InquiryStatus =
  (typeof Inquiry_Status)[keyof typeof Inquiry_Status];

// 3. UI 표시용 매핑
export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  [Inquiry_Status.PENDING]: "대기중",
  [Inquiry_Status.PROCESSING]: "처리중",
  [Inquiry_Status.COMPLETED]: "답변완료",
};

// 4. Select용 옵션 배열
export const INQUIRY_STATUS_OPTIONS = Object.entries(INQUIRY_STATUS_LABELS).map(
  ([value, label]) => ({ label, value: value as InquiryStatus }),
);

// 1. 상태 상수 정의
export const ANSWER_STATUS = {
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
} as const;

// 2. 타입 추출 (자동으로 "PROCESSING" | "COMPLETED"가 됨)
export type AnswerStatus = (typeof ANSWER_STATUS)[keyof typeof ANSWER_STATUS];

// 3. UI 표시용 매핑 (라벨 연결)
export const ANSWER_STATUS_LABELS: Record<AnswerStatus, string> = {
  [ANSWER_STATUS.PROCESSING]: "처리중",
  [ANSWER_STATUS.COMPLETED]: "답변완료",
};

// 4. Select 옵션 생성
export const ANSWER_STATUS_OPTIONS = Object.entries(ANSWER_STATUS_LABELS).map(
  ([value, label]) => ({ label, value: value as AnswerStatus }),
);

// 4. 문의 상세 데이터 타입
export interface UserInquiryData {
  id: string;
  user: UserBasicDto | null;
  title: string;
  content: string;
  createdAt: string;
  metadata?: RequestMetadata;
  currentStatus: InquiryStatus;
}

// 5. 답변 폼 값 타입
export interface AnswerFormValues {
  replyContent: string;
  status: AnswerStatus;
  images?: ImageInfo[]; // 💡 답변용 이미지 추가
}

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
