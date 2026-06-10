/**
 * BookmarkCollectionMap DTO
 *
 * 역할:
 * - FeedItem ↔ Collection 관계 전달용 데이터
 * - API 응답용 최소 구조
 */
export type BookmarkCollectionMapDto = {
  /**
   * mapping ID
   */
  _id: string;

  /**
   * 사용자 ID
   */
  userId: string;

  /**
   * 북마크된 FeedItem ID
   */
  feedItemId: string;

  /**
   * 연결된 컬렉션 ID
   */
  collectionId: string;

  /**
   * 생성 시각
   */
  createdAt: string;

  /**
   * 수정 시각
   */
  updatedAt: string;
};
