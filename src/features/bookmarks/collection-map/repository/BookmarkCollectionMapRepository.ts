import { Types } from "mongoose";
import { BookmarkCollectionMapLean } from "@/shared/types/domain-leans";
import { BookmarkCollectionMapModel } from "../model/bookmark-collection-map";
import { toObjectId } from "@/shared/utils/toObjectId";

/**
 * BookmarkCollectionMapRepository
 *
 * 역할:
 * - FeedItem ↔ Collection 관계 관리
 * - 북마크 분류 (컬렉션 할당/해제)
 * - N:M 관계 처리 전담
 */
export class BookmarkCollectionMapRepository {
  /**
   * 컬렉션에 FeedItem 추가
   *
   * 특징:
   * - 중복 저장 방지 (upsert 기반)
   */
  async addToCollection(params: {
    userId: string | Types.ObjectId;
    feedItemId: string | Types.ObjectId;
    collectionId: string | Types.ObjectId;
  }): Promise<BookmarkCollectionMapLean> {
    const doc = await BookmarkCollectionMapModel.findOneAndUpdate(
      {
        userId: params.userId,
        feedItemId: params.feedItemId,
        collectionId: params.collectionId,
      },
      {
        $setOnInsert: {
          userId: params.userId,
          feedItemId: params.feedItemId,
          collectionId: params.collectionId,
        },
      },
      {
        upsert: true,
        new: true,
      },
    );

    return doc.toObject();
  }

  /**
   * 컬렉션에서 FeedItem 제거
   */
  async removeFromCollection(params: {
    userId: string | Types.ObjectId;
    feedItemId: string | Types.ObjectId;
    collectionId: string | Types.ObjectId;
  }): Promise<void> {
    await BookmarkCollectionMapModel.deleteOne({
      userId: params.userId,
      feedItemId: params.feedItemId,
      collectionId: params.collectionId,
    });
  }

  /**
   * 특정 컬렉션에 연결된 모든 FeedItem 관계 삭제
   */
  async deleteByCollectionId({
    collectionId,
    userId,
  }: {
    collectionId: string | Types.ObjectId;
    userId: string | Types.ObjectId;
  }): Promise<void> {
    await BookmarkCollectionMapModel.deleteMany({
      collectionId: toObjectId(collectionId),
      userId: toObjectId(userId),
    });
  }

  /**
   * 특정 FeedItem이 속한 컬렉션 목록 조회
   */
  async findByFeedItemId(
    feedItemId: string | Types.ObjectId,
  ): Promise<BookmarkCollectionMapLean[]> {
    return BookmarkCollectionMapModel.find({ feedItemId }).lean();
  }

  /**
   * 특정 컬렉션의 FeedItem 목록 조회
   *
   * 보안/정합성:
   * - userId 포함하여 다른 사용자 데이터 접근 방지
   */
  async findByCollectionId(params: {
    userId: string | Types.ObjectId;
    collectionId: string | Types.ObjectId;
  }): Promise<BookmarkCollectionMapLean[]> {
    return BookmarkCollectionMapModel.find({
      userId: params.userId,
      collectionId: params.collectionId,
    }).lean();
  }

  /**
   * 특정 유저 + FeedItem 기준 전체 관계 조회
   */
  async findByUserAndFeedItem(params: {
    userId: string | Types.ObjectId;
    feedItemId: string | Types.ObjectId;
  }): Promise<BookmarkCollectionMapLean[]> {
    return BookmarkCollectionMapModel.find({
      userId: params.userId,
      feedItemId: params.feedItemId,
    }).lean();
  }

  async findByFeedItemIds(
    feedItemIds: (string | Types.ObjectId)[],
  ): Promise<BookmarkCollectionMapLean[]> {
    return BookmarkCollectionMapModel.find({
      feedItemId: {
        $in: feedItemIds.map((id) => toObjectId(id)),
      },
    }).lean();
  }
}
