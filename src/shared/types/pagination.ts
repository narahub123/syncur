/**
 * 페이지네이션 요청 파라미터 공통 타입.
 */
export type PaginationParams = {
  page?: number;
  limit?: number;
};

/**
 * 페이지네이션 응답 메타 정보 공통 타입.
 */
export type PaginationMeta = {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
};

/**
 * 페이지네이션 목록 응답 공통 타입.
 */
export type PaginatedResponse<T> = {
  items: T[];
  pagination: PaginationMeta;
};

/**
 * 커서 기반 무한 스크롤 목록 응답 공통 타입.
 *
 * - items: 현재 요청에서 조회된 목록
 * - nextCursor: 다음 요청에 사용할 커서 값
 * - hasNextPage: 다음 페이지 존재 여부
 */
export type CursorPaginationResponse<T> = {
  items: T[];
  nextCursor: string | null;
  hasNext: boolean;
};

export type SortOrder = "asc" | "desc";