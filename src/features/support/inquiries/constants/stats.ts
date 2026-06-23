import { InquiryStatsDTO } from "../dto/inquiryStatDTO";

export const INQUIRY_STATS_KEY = "inquiry_overview";

export const defaultInquiryStats: InquiryStatsDTO = {
  total: 0,
  pending: 0,
  processing: 0,
  completed: 0,
};

/**
 * 어드민 대시보드 UI 전용 Inquiry 상태 목록 생성 함수
 * - 각 상태와 라벨, 디자인 색상을 1:1로 매핑합니다.
 */
export const getInquiryStatusList = (
  stats: InquiryStatsDTO = defaultInquiryStats,
) => [
  {
    label: "대기중",
    value: stats.pending,
    color: "red", // PENDING 상태
  },
  {
    label: "처리중",
    value: stats.processing,
    color: "violet", // PROCESSING 상태
  },
  {
    label: "답변완료",
    value: stats.completed,
    color: "blue", // COMPLETED 상태
  },
];
