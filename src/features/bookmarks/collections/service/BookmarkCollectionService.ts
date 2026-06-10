import { Types } from "mongoose";
import { BookmarkCollectionRepository } from "../repository/BookmarkCollectionRepository";
import { toBookmarkCollectionDto } from "../mappers/toBookmarkCollectionDto";
import {
  BookmarkCollectionDto,
  BookmarkCollectionUnifiedSearchResponse,
} from "../dto/bookmarkCollectionDto";
import { CursorPaginationResponse } from "@/shared/types/pagination";
import { BookmarkCollectionMapRepository } from "../../collection-map/repository/BookmarkCollectionMapRepository";

export class BookmarkCollectionService {
  constructor(
    private readonly repo: BookmarkCollectionRepository,
    private readonly mapRepo: BookmarkCollectionMapRepository,
  ) {}

  /**
   * 컬렉션 생성
   */
  async create(params: {
    userId: Types.ObjectId | string;
    name: string;
    feedItemId: Types.ObjectId | string;
  }): Promise<BookmarkCollectionDto> {
    const { userId, name, feedItemId } = params;
    const trimmedName = name.trim();

    /**
     * 1. 기존 연결 확인
     */
    const existingMap = await this.mapRepo.findOne({
      userId,
      feedItemId,
    });

    let currentCollection = null;

    if (existingMap) {
      currentCollection = await this.repo.findOne(
        existingMap.collectionId,
        userId,
      );

      /**
       * orphan map 정리
       */
      await this.mapRepo.removeFromCollection({
        userId,
        feedItemId,
        collectionId: existingMap.collectionId,
      });
    }

    /**
     * 2. 현재 컬렉션과 동일한 이름이면 그대로 다시 연결
     */
    if (currentCollection && currentCollection.name === trimmedName) {
      await this.mapRepo.addToCollection({
        userId,
        feedItemId,
        collectionId: currentCollection._id,
      });

      return toBookmarkCollectionDto(currentCollection);
    }

    /**
     * 3. target 컬렉션 resolve
     */
    let targetCollection = await this.repo.findByName({
      userId,
      name: trimmedName,
    });

    if (!targetCollection) {
      try {
        targetCollection = await this.repo.create({
          userId,
          name: trimmedName,
        });
      } catch (e: unknown) {
        const err = e as { code?: number };

        if (err.code === 11000) {
          const fallback = await this.repo.findByName({
            userId,
            name: trimmedName,
          });

          if (!fallback) throw e;

          targetCollection = fallback;
        } else {
          throw e;
        }
      }
    }

    /**
     * 4. 최종 연결
     */
    await this.mapRepo.addToCollection({
      userId,
      feedItemId,
      collectionId: targetCollection._id,
    });

    return toBookmarkCollectionDto(targetCollection);
  }

  /**
   * 컬렉션 이름 수정
   */
  async rename(params: {
    userId: Types.ObjectId | string;
    collectionId: Types.ObjectId | string;
    name: string;
    feedItemId: Types.ObjectId | string;
  }): Promise<BookmarkCollectionDto | null> {
    const userId = params.userId;
    const collectionId = params.collectionId;
    const name = params.name.trim();
    const feedItemId = params.feedItemId;

    /**
     * existing 존재하면 → rename이 아니라 replace 수행
     */
    const existing = await this.repo.findByName({
      userId,
      name,
    });

    if (existing) {
      return this.replaceCollection({
        userId,
        feedItemId,
        currentCollectionId: collectionId,
        nextCollectionId: existing._id,
      });
    }

    /**
     * existing 없으면 실제 rename 수행
     */
    const result = await this.repo.rename({
      userId,
      collectionId,
      name,
    });

    return result ? toBookmarkCollectionDto(result) : null;
  }

  /**
   * 컬렉션 삭제
   */
  async delete(params: {
    userId: Types.ObjectId | string;
    collectionId: Types.ObjectId | string;
  }): Promise<void> {
    const { collectionId, userId } = params;

    // 1. 컬렉션 삭제
    await this.repo.delete({ userId, collectionId });

    // 2. 해당 컬렉션에 연결된 모든 FeedItem 관계 삭제
    await this.mapRepo.deleteByCollectionId({ collectionId, userId });
  }

  /**
   * 유저 전체 컬렉션 조회
   */
  async getAllCollections(
    userId: Types.ObjectId | string,
  ): Promise<BookmarkCollectionDto[]> {
    const result = await this.repo.findAllByUserId(userId);
    return result.map((collection) => toBookmarkCollectionDto(collection));
  }

  /**
   * 유저 컬렉션 검색 + 무한스크롤
   */
  async getCollectionsWithPaging(params: {
    userId: Types.ObjectId | string;
    keyword?: string;
    limit: number;
    cursor?: string;
  }): Promise<CursorPaginationResponse<BookmarkCollectionDto>> {
    const limit = params.limit + 1;

    const result = await this.repo.findByUserIdWithPaging({
      userId: params.userId,
      keyword: params.keyword,
      limit,
      cursor: params.cursor,
    });

    const hasNext = result.length > params.limit;

    const items = hasNext ? result.slice(0, -1) : result;

    const nextCursor =
      items.length > 0 ? items[items.length - 1]._id.toString() : null;

    return {
      items: items.map((item) => toBookmarkCollectionDto(item)),
      nextCursor,
      hasNext,
    };
  }

  /**
   * 전체 컬렉션 검색 (global search)
   */
  async searchGlobalCollections(
    keyword: string,
    limit: number,
  ): Promise<BookmarkCollectionDto[]> {
    const result = await this.repo.searchGlobalCollections({
      keyword,
      limit,
    });

    return result.map((item) => toBookmarkCollectionDto(item));
  }

  /**
   * 통합 컬렉션 검색
   *
   * - user 컬렉션 검색 + global 컬렉션 검색을 동시에 반환
   * - 검색 UX 단일 API 제공
   */
  async searchCollectionsUnified(params: {
    userId: Types.ObjectId | string;
    keyword: string;
    limit: number;
  }): Promise<BookmarkCollectionUnifiedSearchResponse> {
    const { user: users, global: globals } =
      await this.repo.searchCollectionsUnified(params);

    return {
      user: users.map((collection) => toBookmarkCollectionDto(collection)),
      global: globals.map((collection) => toBookmarkCollectionDto(collection)),
    };
  }

  /**
   * 컬렉션 교체
   *
   * 정책:
   * - nextCollectionId 존재 시 해당 컬렉션 사용
   * - nextCollectionName 존재 시 이름으로 조회
   * - 없으면 생성 후 사용
   * - FeedItem ↔ Collection 관계 갱신
   */
  async replaceCollection(params: {
    userId: string | Types.ObjectId;
    feedItemId: string | Types.ObjectId;

    currentCollectionId: string | Types.ObjectId;

    nextCollectionId?: string | Types.ObjectId;
    nextCollectionName?: string;
  }): Promise<BookmarkCollectionDto> {
    let targetCollection;

    /**
     * 기존 컬렉션 선택
     */
    if (params.nextCollectionId) {
      const collection = await this.repo.findOne(
        params.nextCollectionId,
        params.userId,
      );

      /**
       * 존재하지 않거나 소유자가 다른 경우 → 새 컬렉션 생성으로 fallback
       */
      if (!collection || String(collection.userId) !== String(params.userId)) {
        if (!params.nextCollectionName?.trim()) {
          throw new Error("COLLECTION_REQUIRED");
        }

        targetCollection = await this.repo.create({
          userId: params.userId,
          name: params.nextCollectionName,
        });
      } else {
        targetCollection = collection;
      }
    } else {
      if (!params.nextCollectionName?.trim()) {
        throw new Error("COLLECTION_REQUIRED");
      }

      /**
       * 이름으로 조회
       */
      const existing = await this.repo.findByName({
        userId: params.userId,
        name: params.nextCollectionName,
      });

      /**
       * 기존 컬렉션 사용
       */
      if (existing) {
        targetCollection = existing;
      } else {
        /**
         * 새 컬렉션 생성
         */
        targetCollection = await this.repo.create({
          userId: params.userId,
          name: params.nextCollectionName,
        });
      }
    }

    await this.mapRepo.removeFromCollection({
      userId: params.userId,
      feedItemId: params.feedItemId,
      collectionId: params.currentCollectionId,
    });

    await this.mapRepo.addToCollection({
      userId: params.userId,
      feedItemId: params.feedItemId,
      collectionId: targetCollection._id,
    });

    return toBookmarkCollectionDto(targetCollection);
  }
}
