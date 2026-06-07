/**
 * Feed에서 발생할 수 있는 모든 Action 타입
 *
 * 모든 레이어(UI / Server / Dispatcher / Service)가
 * 동일하게 참조하는 단일 Source of Truth
 */

export type FeedAction =
  | "LIKE"
  | "BOOKMARK"
  | "SHARE"
  | "CONTENT_CLICK"
  | "SOURCE_CLICK"
  | "HIDE";
