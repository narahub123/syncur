"use server";

import { auth } from "@/auth";
import { bookmarkCollectionService } from "../service/BookmarkCollectionService.instance";

/**
 * 통합 컬렉션 검색 Server Action
 *
 * 역할:
 * - 사용자 인증 확인
 * - 검색어 검증
 * - user/global 컬렉션 검색 통합 호출
 * - UI에서 바로 사용할 검색 결과 반환
 *
 * 반환 구조:
 * - user: 로그인 사용자 컬렉션 검색 결과
 * - global: 전체 컬렉션 검색 결과 (grouped ranking)
 */
export async function searchCollectionsAction(params: {
  keyword: string;
  limit: number;
}) {
  const session = await auth();

  /**
   * 인증 체크
   * - 로그인되지 않은 경우 접근 차단
   */
  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }

  /**
   * 검색어 검증
   * - 빈 문자열이면 불필요한 DB 호출 방지
   */
  if (!params.keyword?.trim()) {
    return {
      user: [],
      global: [],
    };
  }

  const userId = session.user.id;

  /**
   * service 호출
   * - user/global 검색 병렬 처리 결과 반환
   */
  const result = await bookmarkCollectionService.searchCollectionsUnified({
    userId,
    keyword: params.keyword,
    limit: params.limit,
  });

  return result;
}
