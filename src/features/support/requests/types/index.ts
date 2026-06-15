// 1. 일반 문의 데이터 구조
export interface InquiryEditFormValues {
  title: string;
  content: string;
}

// 2. 버그 신고 데이터 구조 (메타데이터 분해 구조)
export interface BugEditFormValues {
  title: string;
  content: string;
  os: string;
  browser: string;
}

// 3. 서버에서 클라이언트로 내려줄 통합 데이터 인터페이스
export type SupportRequestDetail =
  | { id: string; type: "INQUIRY"; data: InquiryEditFormValues }
  | { id: string; type: "BUG"; data: BugEditFormValues };
