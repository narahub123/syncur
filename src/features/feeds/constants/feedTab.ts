/**
 * 피드 화면에서 사용하는 탭 목록.
 */
export const FEED_TAB = {
  MY: "my",
  POPULAR: "popular",
  RECOMMENDED: "recommended",
} as const;

/**
 * 피드 탭 값 유니온 타입.
 *
 * "my" | "popular" | "recommended"
 */
export type FeedTab = (typeof FEED_TAB)[keyof typeof FEED_TAB];
