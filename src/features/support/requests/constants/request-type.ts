/**
 * 문의 유형
 */
export const REQUEST_TYPE = {
  INQUIRY: "INQUIRY",
  BUG_REPORT: "BUG_REPORT",
} as const;

export type RequestType = (typeof REQUEST_TYPE)[keyof typeof REQUEST_TYPE];

export const REQUEST_TYPE_LABELS: Record<RequestType, string> = {
  [REQUEST_TYPE.INQUIRY]: "1:1 문의",
  [REQUEST_TYPE.BUG_REPORT]: "버그 제보",
};

export const REQUEST_TYPE_OPTIONS = Object.entries(REQUEST_TYPE_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  }),
);

/**
 * 문의 상태
 */
export const REQUEST_STATUS = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  CHECKING: "CHECKING",
  FIXING: "FIXING",
  COMPLETED: "COMPLETED",
  RESOLVED: "RESOLVED",
} as const;

export type RequestStatus =
  (typeof REQUEST_STATUS)[keyof typeof REQUEST_STATUS];

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  [REQUEST_STATUS.PENDING]: "대기중",
  [REQUEST_STATUS.PROCESSING]: "처리중",
  [REQUEST_STATUS.CHECKING]: "확인중",
  [REQUEST_STATUS.FIXING]: "수정중",
  [REQUEST_STATUS.COMPLETED]: "답변완료",
  [REQUEST_STATUS.RESOLVED]: "해결완료",
};

export const REQUEST_STATUS_OPTIONS = Object.entries(REQUEST_STATUS_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  }),
);
