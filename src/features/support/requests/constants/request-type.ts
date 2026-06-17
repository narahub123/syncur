export const REQUEST_TYPE = {
  INQUIRY: "INQUIRY",
  BUG_REPORT: "BUG_REPORT",
} as const;

export type RequestType = (typeof REQUEST_TYPE)[keyof typeof REQUEST_TYPE];

/**
 * 💡 화면(UI) 노출용 한글 라벨 매퍼
 * 프로젝트 전역에서 타입을 보장받으며 한글로 변환할 때 사용합니다.
 */
export const REQUEST_TYPE_LABEL: Record<RequestType, string> = {
  [REQUEST_TYPE.INQUIRY]: "1:1 문의",
  [REQUEST_TYPE.BUG_REPORT]: "버그 제보",
};

export const REQUEST_STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  PROCESSING: "PROCESSING",
  CHECKING: "CHECKING",
  FIXING: "FIXING",
  RESOLVED: "RESOLVED",
} as const;

export const REQUEST_STATUS_OPTIONS = {
  PENDING: "대기중",
  COMPLETED: "답변완료",
  PROCESSING: "처리중",
  CHECKING: "확인중",
  FIXING: "수정중",
  RESOLVED: "해결완료",
} as const;

export type RequestStatus = keyof typeof REQUEST_STATUS;
