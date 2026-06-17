// shared/types/adminBug.ts
import { REQUEST_STATUS } from "@/features/support/requests/constants/request-type";
import { RequestMetadata } from "@/features/support/requests/types/lean";
import { UserBasicDto } from "@/features/users/dto/userDto";
import { CLOUDINARY_FOLDERS } from "@/shared/lib/cloudinary/cloudinary.constant";
import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";
import { FormFieldConfig } from "@/shared/types/form";

// 1. 상태 상수 정의
export const BUG_STATUS = {
  PENDING: REQUEST_STATUS.PENDING,
  CHECKING: REQUEST_STATUS.CHECKING,
  FIXING: REQUEST_STATUS.FIXING,
  COMPLETED: REQUEST_STATUS.COMPLETED,
} as const;

// 2. 타입 추출 ("PENDING" | "REVIEWING" | "FIXING" | "COMPLETED")
export type BugStatus = (typeof BUG_STATUS)[keyof typeof BUG_STATUS];

// 3. UI 표시용 매핑
export const BUG_STATUS_LABELS: Record<BugStatus, string> = {
  [BUG_STATUS.PENDING]: "접수대기",
  [BUG_STATUS.CHECKING]: "확인중",
  [BUG_STATUS.FIXING]: "수정중",
  [BUG_STATUS.COMPLETED]: "해결완료",
};

// 4. Select용 옵션 배열
export const BUG_STATUS_OPTIONS = Object.entries(BUG_STATUS_LABELS).map(
  ([value, label]) => ({ label, value: value as BugStatus }),
);

// 3. 데이터베이스 또는 API에서 넘어오는 유저의 원본 버그 신고 상세 데이터 타입
export interface AdminBugReportDetail {
  _id: string;
  user: UserBasicDto | null;
  title: string;
  content: string;
  createdAt: string;
  metadata?: RequestMetadata;
  currentStatus: BugStatus;
}

// 4. 관리자가 답변 작성 및 상태 변경 시 사용할 Form Values 타입
export interface BugAnswerFormValues {
  replyContent: string;
  status: BugStatus; // string 대신 BugStatus 타입 적용
  images: ImageInfo[];
}

// 5. DynamicForm에 주입할 관리자 전용 설정
export const bugAnswerFormConfig: FormFieldConfig[] = [
  {
    name: "status",
    label: "진행 상태 변경",
    type: "select",
    placeholder: "버그 처리 상태를 선택하세요.",
    options: BUG_STATUS_OPTIONS, // 고정된 배열 대신 타입 안전한 옵션 사용
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
