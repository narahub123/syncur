import { SortOrder } from "@/shared/types/pagination";
import { FILTER_TYPES, FilterValue } from "@/features/admin/constants/filters";
import { RequestMetadata } from "@/features/support/requests/types/lean";
import { UserBasicDto } from "@/features/users/dto/userDto";
import { CLOUDINARY_FOLDERS } from "@/shared/lib/cloudinary/cloudinary.constant";
import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";
import { FormFieldConfig } from "@/shared/types/form";

/**
 * Inquiry Status
 */
export const INQUIRY_STATUS = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
} as const;

export type InquiryStatus =
  (typeof INQUIRY_STATUS)[keyof typeof INQUIRY_STATUS];

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  PENDING: "대기중",
  PROCESSING: "처리중",
  COMPLETED: "답변완료",
};

export const INQUIRY_STATUS_OPTIONS = Object.entries(INQUIRY_STATUS_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  }),
);

/**
 * Answer Status
 */
export const ANSWER_STATUS = {
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
} as const;

export type AnswerStatus = (typeof ANSWER_STATUS)[keyof typeof ANSWER_STATUS];

export const ANSWER_STATUS_LABELS: Record<AnswerStatus, string> = {
  PROCESSING: "처리중",
  COMPLETED: "답변완료",
};

export const ANSWER_STATUS_OPTIONS = Object.entries(ANSWER_STATUS_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  }),
);

/**
 * Search Field
 */
export const INQUIRY_SEARCH_FIELD = {
  TITLE: "title",
  CONTENT: "content",
  USER: "user",
} as const;

export type InquirySearchField =
  (typeof INQUIRY_SEARCH_FIELD)[keyof typeof INQUIRY_SEARCH_FIELD];

export const INQUIRY_SEARCH_FIELD_LABELS: Record<InquirySearchField, string> = {
  title: "제목",
  content: "내용",
  user: "사용자",
};

export const INQUIRY_SEARCH_FIELD_OPTIONS = Object.entries(
  INQUIRY_SEARCH_FIELD_LABELS,
).map(([value, label]) => ({
  value,
  label,
}));

/**
 * Sort
 */
export const INQUIRY_SORT = {
  STATUS: "status",
  TITLE: "title",
  USER: "user",
  CREATED_AT: "createdAt",
} as const;

export type InquirySort = (typeof INQUIRY_SORT)[keyof typeof INQUIRY_SORT];

export const INQUIRY_SORT_LABELS: Record<InquirySort, string> = {
  status: "상태순",
  title: "제목순",
  user: "사용자순",
  createdAt: "작성일순",
};

/**
 * Page Size
 */
export const INQUIRY_PAGE_SIZE = {
  DEFAULT: 10,
  TWENTY: 20,
  FIFTY: 50,
} as const;

export type InquiryPageSize =
  (typeof INQUIRY_PAGE_SIZE)[keyof typeof INQUIRY_PAGE_SIZE];

export const INQUIRY_PAGE_SIZE_OPTIONS = Object.entries(INQUIRY_PAGE_SIZE).map(
  ([_, value]) => ({
    label: `${value}개`,
    value,
  }),
);

/**
 * Filter
 */
export const INQUIRY_INITIAL_FILTER_VALUE = {
  status: ["all"],
};

export const INQUIRY_FILTER_CONFIG = {
  status: {
    label: "처리 상태",
    type: FILTER_TYPES.MULTI_SELECT,
    options: [
      { label: "전체", value: "all" as const },
      ...INQUIRY_STATUS_OPTIONS,
    ],
  },
} as const;

export type InquiryFilterKey = keyof typeof INQUIRY_FILTER_CONFIG;

/**
 * Query (BugReport 구조와 동일)
 */
export interface InquiryQuery {
  page: number;
  limit: InquiryPageSize;
  search: string;
  searchField: InquirySearchField;
  sort: InquirySort;
  sortOrder: SortOrder;
  filters: Partial<Record<InquiryFilterKey, FilterValue>>;
}

/**
 * Detail / Answer
 */
export interface UserInquiryData {
  id: string;
  user: UserBasicDto | null;
  title: string;
  content: string;
  createdAt: string;
  metadata?: RequestMetadata;
  currentStatus: InquiryStatus;
}

export interface AnswerFormValues {
  replyContent: string;
  status: AnswerStatus;
  images?: ImageInfo[];
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
