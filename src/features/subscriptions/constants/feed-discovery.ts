/**
 * UI 상태별 스크린리더(A11y) 전용 문구 매핑
 *
 * 역할:
 * - screen reader에게 현재 UI 상태를 설명
 * - UI 메시지와 분리하여 접근성 의미를 명확하게 전달
 * - aria-live 영역 또는 role=status와 함께 사용
 *
 * 특징:
 * - 사용자에게 직접 노출되는 문구가 아님
 * - 상태 변화만 설명하는 짧은 표현 중심
 */
export const FEED_STATUS_A11Y = {
  idle: "대기 상태",
  typing: "URL 입력 중",
  searching_site: "사이트 검색 중",
  site_selected: "사이트 선택됨",
  discovering: "피드 탐색 중",
  feed_found: "구독 가능한 피드 발견",
  feed_not_supported: "피드 없음",
  subscribing: "구독 처리 중",
  subscribed: "구독 완료",
  error: "오류 상태",
} as const;

/**
 * UI 상태별 사용자 표시 메시지 매핑
 *
 * 역할:
 * - 화면에 실제로 보여지는 텍스트 정의
 * - StatusIndicator 및 일부 UI 컴포넌트에서 사용
 * - UIState와 1:1로 매핑되어 UI 표현을 표준화
 *
 * 특징:
 * - 사용자에게 직접 노출되는 문구
 * - 상태별 UX 메시지 일관성 유지 목적
 */
export const FEED_STATUS_MESSAGE = {
  idle: "",
  typing: "URL을 입력 중입니다",
  searching_site: "사이트를 검색하고 있습니다",
  site_selected: "사이트가 선택되었습니다",
  discovering: "구독 가능한 피드를 찾고 있습니다",
  feed_found: "구독 가능한 피드를 찾았습니다",
  feed_not_supported: "구독 가능한 피드를 찾지 못했습니다",
  subscribing: "구독을 처리하고 있습니다",
  subscribed: "구독이 완료되었습니다",
  error: "오류가 발생했습니다",
} as const;
