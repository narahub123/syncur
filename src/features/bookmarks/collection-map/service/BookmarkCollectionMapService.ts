import { Types } from "mongoose";
import { bookmarkCollectionMapRepository } from "../repository/BookmarkCollectionMapRepository.instance";
import { BookmarkCollectionMapDto } from "../dto/bookmarkCollectionMapDto";
import { toBookmarkCollectionMapDto } from "../mappers/toBookmarkCollectionMapDto";

/**
 * BookmarkCollectionMapService
 *
 * 역할:
 * - FeedItem ↔ Collection 관계 비즈니스 로직
 * - 북마크 분류 시스템 핵심 레이어
 */
export class BookmarkCollectionMapService {
  /**
   * FeedItem을 컬렉션에 추가
   *
   * 정책:
   * - 중복 추가 방지 (repository unique index 의존)
   */
  async addToCollection(params: {
    userId: string | Types.ObjectId;
    feedItemId: string | Types.ObjectId;
    collectionId: string | Types.ObjectId;
  }): Promise<BookmarkCollectionMapDto> {
    const result =
      await bookmarkCollectionMapRepository.addToCollection(params);
    return toBookmarkCollectionMapDto(result);
  }

  /**
   * FeedItem을 컬렉션에서 제거
   */
  async removeFromCollection(params: {
    userId: string | Types.ObjectId;
    feedItemId: string | Types.ObjectId;
    collectionId: string | Types.ObjectId;
  }): Promise<void> {
    await bookmarkCollectionMapRepository.removeFromCollection(params);
  }

  /**
   * FeedItem이 속한 모든 컬렉션 조회
   *
   * UI에서 "이 글이 어디에 저장됐는지" 표시할 때 사용
   */
  async getFeedItemCollections(
    feedItemId: string | Types.ObjectId,
  ): Promise<BookmarkCollectionMapDto[]> {
    const collections =
      await bookmarkCollectionMapRepository.findByFeedItemId(feedItemId);

    return collections.map((collection) =>
      toBookmarkCollectionMapDto(collection),
    );
  }

  /**
   * 컬렉션 이동
   *
   * 의미:
   * - 기존 컬렉션에서 제거
   * - 새로운 컬렉션에 추가
   *
   * 특징:
   * - 순차 실행 (데이터 정합성 보장)
   */
  async moveToCollection(params: {
    userId: string | Types.ObjectId;
    feedItemId: string | Types.ObjectId;
    fromCollectionId: string | Types.ObjectId;
    toCollectionId: string | Types.ObjectId;
  }): Promise<BookmarkCollectionMapDto> {
    await bookmarkCollectionMapRepository.removeFromCollection({
      userId: params.userId,
      feedItemId: params.feedItemId,
      collectionId: params.fromCollectionId,
    });

    const result = await bookmarkCollectionMapRepository.addToCollection({
      userId: params.userId,
      feedItemId: params.feedItemId,
      collectionId: params.toCollectionId,
    });

    return toBookmarkCollectionMapDto(result);
  }
}
