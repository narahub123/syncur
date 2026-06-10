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
  }): Promise<BookmarkCollectionDto> {
    const result = await this.repo.create(params);
    return toBookmarkCollectionDto(result);
  }

  /**
   * 컬렉션 이름 수정
   */
  async rename(params: {
    userId: Types.ObjectId | string;
    collectionId: Types.ObjectId | string;
    name: string;
  }): Promise<BookmarkCollectionDto | null> {
    const result = await this.repo.rename(params);

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
}
