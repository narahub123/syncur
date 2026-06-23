export interface InquiryStatsDTO {
  total: number; // 총 문의 개수
  pending: number; // 대기중 개수 (PENDING)
  processing: number; // 처리중 개수 (PROCESSING)
  completed: number; // 답변완료 개수 (COMPLETED)
}
