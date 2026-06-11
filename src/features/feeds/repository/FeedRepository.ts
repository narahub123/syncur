import { FeedModel } from "../model/feed";
import { Types } from "mongoose";
import { FeedLean } from "@/shared/types/domain-leans";
import { toObjectId } from "@/shared/utils/toObjectId";
import {
  FeedWithSiteLean,
  FeedWithSiteLeanPagedResponse,
} from "../dto/feedDto";

/**
 * FeedRepository
 *
 * - Feed 컬렉션에 대한 DB 접근 계층
 * - 순수 CRUD만 담당 (비즈니스 로직 금지)
 *
 * 역할:
 * - Feed 조회
 * - Feed 생성
 * - Feed 업데이트/삭제 (추후 확장)
 *
 * NOTE:
 * - Site ↔ Feed 연결 로직은 Service 계층에서 처리
 */
export class FeedRepository {
  /**
   * siteId 기준으로 Feed 조회
   *
   * @param siteId - Site ObjectId
   *
   * @returns 해당 Site에 연결된 Feed (1:1 구조)
   *
   * 특징:
   * - Site당 Feed는 1개만 존재하도록 설계됨
   * - 없으면 null 반환
   */

  async findBySiteId(
    siteId: string | Types.ObjectId,
  ): Promise<FeedLean | null> {
    return await FeedModel.findOne({ siteId: toObjectId(siteId) })
      .lean()
      .exec();
  }

  /**
   * Feed 생성
   *
   * @param data
   * - siteId: 연결된 Site ObjectId
   * - feedUrl: 실제 RSS/Atom URL
   * - status: Feed 상태 (기본 active)
   * - errorCount: 실패 횟수 초기값
   * - categories: Feed 전체 분류 태그
   *
   * @returns 생성된 Feed Document
   *
   * 특징:
   * - Service 계층에서 호출되어야 함
   * - idempotency 보장은 Repository가 아닌 Service 책임
   */
  async create(data: {
    siteId: string | Types.ObjectId;
    feedUrl: string;
    status?: "active" | "error" | "disabled";
    errorCount?: number;
    categories?: string[];
  }): Promise<FeedLean | null> {
    const doc = await FeedModel.create({
      siteId: toObjectId(data.siteId),
      feedUrl: data.feedUrl,
      status: data.status ?? "active",
      errorCount: data.errorCount ?? 0,
      categories: data.categories ?? [],
    });

    return doc.toObject();
  }

  /**
   * 여러 Feed ID로 Feed 목록 조회
   *
   * @description
   * Subscription → Feed → Site 흐름에서
   * Feed를 batch로 가져오기 위한 메서드
   *
   * @param feedIds Feed ObjectId 문자열 배열
   *
   * @returns Feed 목록
   */
  async findByIds(feedIds: string[] | Types.ObjectId[]): Promise<FeedLean[]> {
    return FeedModel.find({
      _id: { $in: feedIds.map((id) => toObjectId(id)) },
    }).lean();
  }

  /**
   * Feed 목록 조회 (페이지네이션 + 검색)
   *
   * @param params.page 페이지 번호
   * @param params.limit 페이지 크기
   * @param params.search feedUrl / categories 검색
   */
  async findAllPaginated(params: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<FeedWithSiteLeanPagedResponse> {
    const { page, limit, search } = params;

    const skip = (page - 1) * limit;

    const filter = search
      ? {
          $or: [
            { feedUrl: { $regex: search, $options: "i" } },
            { categories: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [items, totalCount] = await Promise.all([
      FeedModel.find(filter)
        .populate({
          path: "siteId",
          select: "name url favicon_url feed_url",
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<FeedWithSiteLean[]>()
        .exec(),

      FeedModel.countDocuments(filter),
    ]);

    // orphan 데이터 처리 방법을 추가해야 함
    return {
      items: items.filter((f) => f.siteId !== null),
      totalCount,
    };
  }
}
